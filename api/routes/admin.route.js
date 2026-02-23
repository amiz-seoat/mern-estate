import express from "express";
import {
  deleteListingAdmin,
  deleteUserAdmin,
  getAdminStats,
  getAllListingsAdmin,
  getAllUsers,
  updateListingAdmin,
} from "../controllers/admin.controller.js";
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";

const adminRouter = express.Router();

adminRouter.get("/users", verifyToken, verifyAdmin, getAllUsers);
adminRouter.delete("/users/:id", verifyToken, verifyAdmin, deleteUserAdmin);

adminRouter.get("/listings", verifyToken, verifyAdmin, getAllListingsAdmin);
adminRouter.delete(
  "/listings/:id",
  verifyToken,
  verifyAdmin,
  deleteListingAdmin,
);
adminRouter.post("/listings/:id", verifyToken, verifyAdmin, updateListingAdmin);

adminRouter.get("/stats", verifyToken, verifyAdmin, getAdminStats);


export default adminRouter;
