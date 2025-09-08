import VENDOR from "../models/vendorModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

export const vendorSignupController = async (req, res) => {
  try {
    const {
      business_name,
      owner_name,
      email,
      phone,
      category,
      location,
      password,
    } = req.body;

    if (
      !business_name ||
      !owner_name ||
      !email ||
      !phone ||
      !category ||
      !location ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVendor = await VENDOR.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await VENDOR.create({
      business_name,
      owner_name,
      email,
      phone,
      category,
      location,
      password: hashedPassword,
      status: "pending",
    });

    res.status(201).json({
      message: "Vendor registered successfully. Awaiting admin approval.",
      vendor: newVendor,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const vendorLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const vendor = await VENDOR.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  
    if (vendor.status !== "approved") {
      return res.status(403).json({
        message:
          "Your account is not approved yet. Please wait for admin approval.",
      });
    }

    const token = generateToken(vendor._id);

    res.status(200).json({
      message: "Login successful",
      token,
      vendor,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const vendorLogoutController = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVendorProfileController = async (req, res) => {
  try {
    const { logo, vendorId } = req.body;

    if (!logo || !vendorId) {
      return res.status(400).json({
        success: false,
        message: "Logo and vendorId are required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(logo, {
      folder: "vendor_logos",
    });

    const updatedVendor = await VENDOR.findByIdAndUpdate(
      vendorId,
      { logo: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor logo updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating vendor profile",
    });
  }
};