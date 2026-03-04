import crypto from "crypto";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { setTokenCookie, clearTokenCookie } from "../utils/cookie.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.js";

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const isAdmin = email === "abduselammiz78@gmail.com";

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      isAdmin,
      verificationToken,
      verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    try {
      await sendVerificationEmail(newUser.email, verificationToken);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    res.status(201).json({
      message:
        "Account created! Please check your email to verify your account.",
      requiresVerification: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(
        errorHandler(409, `An account with that ${field} already exists`),
      );
    }
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return next(errorHandler(400, "Verification token is required."));

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return next(errorHandler(400, "Invalid or expired verification link."));

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now sign in." });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "Email is required."));

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return next(errorHandler(404, "No account found with that email."));
    if (user.isVerified) return next(errorHandler(400, "This account is already verified."));

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    if (!validUser.isVerified) {
      return next(
        errorHandler(403, "Please verify your email before signing in. Check your inbox for the verification link."),
      );
    }

    if (email.trim().toLowerCase() === "abduselammiz78@gmail.com" && !validUser.isAdmin) {
      validUser.isAdmin = true;
      await validUser.save();
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = generateToken({
      id: validUser._id,
      isAdmin: validUser.isAdmin,
    });
    const { password: pass, ...rest } = validUser._doc;

    setTokenCookie(res, token);
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    if (!email) return next(errorHandler(400, "Email is required"));

    let user = await User.findOne({ email });

    if (user) {
      const defaultAvatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      if (photo && (!user.avatar || user.avatar === "" || user.avatar === defaultAvatar)) {
        user.avatar = photo;
      }
      if (email === "abduselammiz78@gmail.com" && !user.isAdmin) {
        user.isAdmin = true;
      }
      if (!user.isVerified) user.isVerified = true;
      await user.save();

      const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
      const { password, ...rest } = user._doc;

      setTokenCookie(res, token);
      return res.status(200).json(rest);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const username = name
      ? name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)
      : "user" + Math.random().toString(36).slice(-6);

    const isAdmin = email === "abduselammiz78@gmail.com";
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: photo || undefined,
      isAdmin,
      isVerified: true,
    });

    await newUser.save();

    const token = generateToken({ id: newUser._id, isAdmin: newUser.isAdmin });
    const { password: pass, ...rest } = newUser._doc;

    setTokenCookie(res, token);
    res.status(201).json(rest);
  } catch (error) {
    console.error("Google OAuth error:", error);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "Email is required."));

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        message: "If an account exists with that email, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordTokenExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      message: "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return next(errorHandler(400, "Invalid or expired reset token."));

    user.password = bcryptjs.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now sign in." });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    clearTokenCookie(res);
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export default google;
