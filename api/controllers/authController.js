import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
   const { username, email, password } = req.body

   const hashedPassword = bcryptjs.hashSync(password, 10);

   const newUser = new User ({username, email, password: hashedPassword})

   try{
      await newUser.save()
      res.status(201).json("user created successfully")
   } catch (error) {
       next(error);
   }

}

export const signin = async (req, res, next)=>{
   const {email, password}=req.body
   
   try {
      const validUser = await User.findOne({email})
      if (!validUser) return next(errorHandler(404, 'User not found!'))
      const validPassword = bcryptjs.compareSync(password, validUser.password)
      if (!validPassword) return next(errorHandler(401, 'wrong credentials!'))
      
      const token = jwt.sign({id: validUser._id }, process.env.JWT_SECRET)

      const {password: pass, ...rest} = validUser._doc;

      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)

   } catch (error) {
      next(error)
   }
}

const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    // 1️⃣ Validate required fields
    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    // 2️⃣ Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists → generate token and return
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { password, ...rest } = user._doc;
      return res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    }

    // 3️⃣ User does not exist → create new user
    // Generate a secure random password for Google users
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    // Safe username generation
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

    // 4️⃣ Generate JWT token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { password: pass, ...rest } = newUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(201).json(rest);
  } catch (error) {
    console.error("Google OAuth error:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const signOut = async (req, res, next)=>{
   try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!')
      
   } catch (error) {
      next(error)
   }
}

export default google