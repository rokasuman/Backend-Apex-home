import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to use this website",
      });
    }

    // Split the token
    const splittedToken = token.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(splittedToken, process.env.JWT_SECRET);

    // Find user
    req.user = await User.findById(decoded.id).select("-password");

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if user is blocked
    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact admin.",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token or token expired",
    });
  }
};

//base role middleware
export const authorize = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denined",
      });
    }
    next();
  };
};
