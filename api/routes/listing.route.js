import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
  getPublicStats,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import {
  validateCreateListing,
  validateSearchQuery,
} from "../utils/validate.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, validateCreateListing, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.post("/update/:id", verifyToken, updateListing);
listingRouter.get("/stats", getPublicStats);
listingRouter.get("/get/:id", getListing);
listingRouter.get("/get", validateSearchQuery, getListings);

export default listingRouter;
