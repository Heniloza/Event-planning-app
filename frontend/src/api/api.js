import axios from "axios";
import Toast from "react-native-toast-message";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const verifyOtp = async (userId, otp) => {
  try {
    const res = await axiosInstance.post("/auth/verify", {
      userId,
      otp: otp.join(""),
    });
    return res.data;
  } catch (error) {
    console.log("OTP verify error:", error.response?.data || error.message);
    Toast.show({
      type: "error",
      text2: error.response?.data?.message || "Something went wrong",
    });
    return null;
  }
};