import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account = null;

    if (decoded.role === "vendor") {
      account = await Vendor.findById(decoded.id).select("-password");
      if (!account)
        return res.status(404).json({ message: "Vendor not found" });
      req.vendor = account;
    } else if (decoded.role === "user") {
      account = await User.findById(decoded.id).select("-password");
      if (!account) return res.status(404).json({ message: "User not found" });
      req.user = account;
    } else {
      return res.status(401).json({ message: "Invalid role" });
    }

    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};
