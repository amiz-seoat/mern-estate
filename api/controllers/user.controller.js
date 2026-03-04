import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { clearTokenCookie } from "../utils/cookie.js";
import bcryptjs from "bcryptjs";

 export const test = (req, res)=>{
    res.json({
        message:'Hello world!',
    }) 
};

export const updateUser =async (req,res,next)=>{
  if(req.user.id!== req.params.id) return next (errorHandler(401, "you can only update your own account"))
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar, 

            }
        }, {new: true}) 

        const {password, ...rest}=updatedUser._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next)=>{
    if (req.user.id!==req.params.id) return next(errorHandler(401, 'You can only delete your own account'))
        try {
            await User.findByIdAndDelete(req.params.id)
            clearTokenCookie(res)
            res.status(200).json('User has been deleted!')
        } catch (error) {
            next(error)
        }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401,'You can only view your own listings!'))
    }
}

export const toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listingId } = req.params;
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found."));

    const index = user.favorites.indexOf(listingId);
    if (index === -1) {
      user.favorites.push(listingId);
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, "User not found."));

    const listings = await Listing.find({ _id: { $in: user.favorites } });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return next(errorHandler(404, 'User not found!'))
        const { password: pass, ...rest } = user._doc;
        
        res.status(200).json(rest);

    } catch (error) {
        next(error)
    }
}
