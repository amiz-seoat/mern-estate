import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search?.trim() || "";

    const filter = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next(errorHandler(400, "Admin cannot delete own account."));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    await Listing.deleteMany({ userRef: req.params.id });
    res.status(200).json({ message: "User deleted." });
  } catch (error) {
    next(error);
  }
};

export const getAllListingsAdmin = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const [listings, total] = await Promise.all([
      Listing.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Listing.countDocuments(),
    ]);

    res.status(200).json({
      listings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListingAdmin = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted." });
  } catch (error) {
    next(error);
  }
};

export const updateListingAdmin = async (req, res, next) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalListings,
      offerListings,
      rentListings,
      saleListings,
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ offer: true }),
      Listing.countDocuments({ type: "rent" }),
      Listing.countDocuments({ type: "sale" }),
    ]);

    res.status(200).json({
      totalUsers,
      totalListings,
      offerListings,
      rentListings,
      saleListings,
    });
  } catch (error) {
    next(error);
  }
};
