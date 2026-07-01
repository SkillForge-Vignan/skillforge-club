import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "skillforge_super_secret_key_change_in_prod";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new UnauthorizedError("No token provided"));
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Invalid token format. Use: Bearer <token>"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new UnauthorizedError("Token missing"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expired. Please login again."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token"));
    }
    return next(new UnauthorizedError("Authentication failed"));
  }
};

export const studentOnly = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Not logged in"));
  }
  if (req.user.role !== "student") {
    return next(new ForbiddenError("Student access required"));
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Not logged in"));
  }

  if (req.user.role !== "admin") {
    return next(new ForbiddenError("Admin access required"));
  }

  next();
};

export const mentorOnly = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Not logged in"));
  }

  if (req.user.role !== "mentor" && req.user.role !== "admin") {
    return next(new ForbiddenError("Mentor access required"));
  }

  next();
};

export const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      type: "refresh",
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (err) {
    throw new UnauthorizedError("Invalid refresh token");
  }
};