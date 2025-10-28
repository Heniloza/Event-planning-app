import axios from "axios";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

const LOCAL_IP = "10.60.19.176";; 

export const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000/api" 
    : `http://${LOCAL_IP}:3000/api`;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export const verifyOtp = async (userId, otp) => {
  try {
    const res = await axiosInstance.post("/auth/verify", {
      userId,
      otp: otp.join(""),
    });
    console.log(res," OTP verify response");
    
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

export const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
