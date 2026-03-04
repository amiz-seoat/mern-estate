import express from "express";
import {
  google,
  signup,
  signin,
  signOut,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateSignup,
  validateSignin,
  validatePasswordReset,
} from "../utils/validate.js";

const authRouter = express.Router();

authRouter.post("/signup", validateSignup, signup);
authRouter.post("/signin", validateSignin, signin);
authRouter.post("/google", google);
authRouter.get("/signout", signOut);

authRouter.get("/verify-email", verifyEmail);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", validatePasswordReset, resetPassword);

export default authRouter;
