import USER from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateOtp } from "./otpController.js";
import cloudinary from "../utils/cloudinary.js";

export const signupController = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    if (!name || !email || !password || !phone || !city) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await USER.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await USER.create({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      isFirstLogin: true,
    });

    await generateOtp(newUser?._id);

    res.status(201).json({
      success: true,
      user: newUser,
      message: "New User created",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to signup",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await USER.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch)
      return res.status(400).json({
      message: "Invalid credentials",
      });

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
    }

    await generateOtp(user?._id);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error in logout",
    });
  }
};

export const updateProfileImageController = async (req, res) => {
  try {
    const { profileImage,userId} = req.body;

    if (!profileImage || !userId) {
      return res.status(400).json({
        success: false,
        message: "Image and userId are required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profileImage, {
      folder: "user_profiles", 
    });

    const updatedUser = await USER.findByIdAndUpdate(
      userId,
      { profileImage: uploadResponse.secure_url },
      { new: true }
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
    
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating profile",
    });
  }
};

export const updateUserProfileController = async (req, res) => {
  try {
    const { userId, ...updates } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const disallowedFields = ["password", "status", "role", "email"];
    disallowedFields.forEach((field) => delete updates[field]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedUser = await USER.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user profile",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await USER.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking auth",
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await USER.find().select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } 
  catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({

      success: false,
      message: "Internal server error while fetching users",
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await USER.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
