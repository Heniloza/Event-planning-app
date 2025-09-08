import { create } from "zustand";
import Toast from "react-native-toast-message";
import { axiosInstance } from "../api/api.js";

export const useVendorAuthStore = create((set) => ({
  vendor: null,
  isAuthenticated: false,
  isLoggedIn: false,

  isLoading: false,
  isLoggingIn: false,
  isSigningIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  setVendor: (vendor) => set({ vendor }),
  setIsLoggedIn: (state) => set({ isLoggedIn: state }),
  setIsAuthenticated: (state) => set({ isAuthenticated: state }),

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/vendor/login", data);

      if (res.data.vendor.status !== "approved") {
        Toast.show({
          type: "error",
          text1:
            "Your account is not approved yet. Please wait for admin approval.",
        });
        set({ isLoggedIn: false, isAuthenticated: false });
        return;
      }

      set({
        vendor: res.data.vendor,
        isLoggedIn: true,
        isAuthenticated: true,
      });

      console.log("Vendor login response:", res.data);

      Toast.show({
        type: "success",
        text1: "Login Successful",
      });
    } catch (error) {
      console.error(
        "Vendor Login error:",
        error.response?.data || error.message
      );
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Login failed",
      });
      set({ isLoggedIn: false, isAuthenticated: false });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/vendor/signup", data);

      set({
        vendor: res.data.vendor,
        isLoggedIn: true,
        isAuthenticated: true,
      });

      console.log("Vendor signup response:", res.data);

      Toast.show({
        type: "success",
        text1: "Signup Successful",
      });
    } catch (error) {
      console.error(
        "Vendor Signup error:",
        error.response?.data || error.message
      );
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Signup failed",
      });
      set({ isLoggedIn: false, isAuthenticated: false });
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/vendor/logout");

      set({
        vendor: null,
        isAuthenticated: false,
        isLoggedIn: false,
      });

      Toast.show({
        type: "success",
        text1: "Logged out successfully!",
      });
    } catch (error) {
      console.error("Vendor Logout error:", error.message);
      Toast.show({
        type: "error",
        text1: "Failed to logout",
      });
    }
  },

  updateVendorProfile:async (logo,vendorId) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/vendor/update-profile", { logo, vendorId });
      set({ vendor: res.data.vendor });
      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
    } 
    catch (error) {
      console.error("Update Vendor Profile error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },


}));
