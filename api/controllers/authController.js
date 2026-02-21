import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  try {
    // Validate all fields are present
    if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    // Handle duplicate username or email
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(errorHandler(409, `An account with that ${field} already exists`));
    }
    next(error);
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  try {
    // Validate required fields
    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required'));
    }

    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorHandler(404, 'User not found!'))

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'))

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    const { password: pass, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)

  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { password, ...rest } = user._doc;
      return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    }

    // New Google user — generate a random password
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const username = name
      ? name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)
      : "user" + Math.random().toString(36).slice(-6);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: photo || "",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { password: pass, ...rest } = newUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(201).json(rest);
  } catch (error) {
    console.error("Google OAuth error:", error);
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!')

  } catch (error) {
    next(error)
  }
}

export default google