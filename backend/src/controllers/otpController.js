import USER from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import sendOtp from "../utils/sendOtp.js"
import { generateToken } from "../utils/generateToken.js";

export const generateOtp = async (userId) => {
  const user = await USER.findById(userId);
  if (!user) throw new Error("User not found");

  await OTP.deleteMany({ userId });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.create({ userId, otp, expiresAt });

  await sendOtp(user.email, otp);

  return otp;
};

export const verifyOtpController = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        message: "UserId and OTP are required",
        success: false,
      });
    }

    const otpToken = await OTP.findOne({ userId });
    if (!otpToken) {
      return res.status(404).json({
        message: "OTP not found or expired",
        success: false,
      });
    }

    if (otpToken.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpToken._id });
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    if (otpToken.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    await OTP.deleteOne({ _id: otpToken._id });

    const user = await USER.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.isVerified = true;
    await user.save();

    const token = generateToken(user?._id);

    return res.status(200).json({
      message: "OTP Verified successfully",
      user,
      token, 
      success: true,
    });
    
  } catch (error) {
    console.error("Error in verifying OTP:", error.message);
    return res.status(500).json({
      message: "Unable to verify OTP",
      success: false,
    });
  }
};

