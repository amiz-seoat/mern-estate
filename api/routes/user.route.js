import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
  toggleFavorite,
  getFavorites,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { validateUpdateUser } from "../utils/validate.js";

const userRouter = express.Router();
userRouter.get("/test", test);
userRouter.post("/update/:id", verifyToken, validateUpdateUser, updateUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.get("/listings/:id", verifyToken, getUserListings);
userRouter.post("/favorites/:listingId", verifyToken, toggleFavorite);
userRouter.get("/favorites", verifyToken, getFavorites);
userRouter.get("/:id", verifyToken, getUser);

export default userRouter;
