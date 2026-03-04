import { errorHandler } from "./error.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SORT_FIELDS = ["createdAt", "regularPrice", "name"];

export function validateSignup(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return next(errorHandler(400, "All fields are required."));
  if (typeof username !== "string" || username.trim().length < 3)
    return next(errorHandler(400, "Username must be at least 3 characters."));
  if (username.trim().length > 30)
    return next(errorHandler(400, "Username must be at most 30 characters."));
  if (!EMAIL_RE.test(email))
    return next(errorHandler(400, "Please enter a valid email address."));
  if (password.length < 6)
    return next(errorHandler(400, "Password must be at least 6 characters."));
  next();
}

export function validateSignin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password)
    return next(errorHandler(400, "Email and password are required."));
  if (!EMAIL_RE.test(email))
    return next(errorHandler(400, "Please enter a valid email address."));
  next();
}

export function validateUpdateUser(req, res, next) {
  const { username, email, password } = req.body;
  if (username !== undefined) {
    if (typeof username !== "string" || username.trim().length < 3)
      return next(errorHandler(400, "Username must be at least 3 characters."));
    if (username.trim().length > 30)
      return next(errorHandler(400, "Username must be at most 30 characters."));
  }
  if (email !== undefined && !EMAIL_RE.test(email))
    return next(errorHandler(400, "Please enter a valid email address."));
  if (password !== undefined && password.length < 6)
    return next(errorHandler(400, "Password must be at least 6 characters."));
  next();
}

export function validateCreateListing(req, res, next) {
  const { name, description, address, regularPrice, discountPrice, type, imageUrls } = req.body;
  if (!name || !description || !address)
    return next(errorHandler(400, "Name, description, and address are required."));
  if (typeof name !== "string" || name.trim().length < 3)
    return next(errorHandler(400, "Listing name must be at least 3 characters."));
  if (name.trim().length > 100)
    return next(errorHandler(400, "Listing name must be at most 100 characters."));
  if (regularPrice === undefined || isNaN(Number(regularPrice)) || Number(regularPrice) < 0)
    return next(errorHandler(400, "Regular price must be a non-negative number."));
  if (discountPrice !== undefined && (isNaN(Number(discountPrice)) || Number(discountPrice) < 0))
    return next(errorHandler(400, "Discount price must be a non-negative number."));
  if (!type || !["rent", "sale"].includes(type))
    return next(errorHandler(400, "Type must be 'rent' or 'sale'."));
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0)
    return next(errorHandler(400, "At least one image is required."));
  if (imageUrls.length > 6)
    return next(errorHandler(400, "Maximum 6 images allowed."));
  next();
}

export function validateSearchQuery(req, res, next) {
  const { sort, limit, startIndex } = req.query;
  if (sort && !ALLOWED_SORT_FIELDS.includes(sort)) {
    req.query.sort = "createdAt";
  }
  if (limit && (isNaN(Number(limit)) || Number(limit) > 50)) {
    req.query.limit = "9";
  }
  if (startIndex && isNaN(Number(startIndex))) {
    req.query.startIndex = "0";
  }
  next();
}

export function validatePasswordReset(req, res, next) {
  const { token, password } = req.body;
  if (!token)
    return next(errorHandler(400, "Reset token is required."));
  if (!password || password.length < 6)
    return next(errorHandler(400, "Password must be at least 6 characters."));
  next();
}
