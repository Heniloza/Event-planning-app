import {create} from "zustand"
import Toast from "react-native-toast-message";
import {axiosInstance,setAuthHeader} from "../api/api.js";
import { saveToken, getToken, removeToken } from "../utils/tokenStorage.js";


export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoggedIn: false,

  isLoading: false,
  isLoggingIn: false,
  isSigningIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  setUser: (user) => set({ user }),
  setIsLoggedIn: (state) => set({ isLoggedIn: state }),
  setIsAuthenticated: (state) => set({ isAuthenticated: state }),

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({
        user: res.data.user,
        isLoggedIn: true,
      });
      console.log(res);
      console.log(useAuthStore.getState().user, "its user");

      Toast.show({
        type: "success",
        text1: "Login Successful,Please verify OTP",
      });
    } catch (error) {
      console.error("Login error:", error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || error.message || "Login failed",
      });
      set({ isLoggedIn: false, isAuthenticated: false });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({
        user: res.data.user,
        isLoggedIn: true,
      });
      console.log(res, "API response");
      console.log(useAuthStore.getState().user, "its user");

      Toast.show({
        type: "success",
        text1: "Signup successfully,please verify OTP",
      });
    } catch (error) {
      console.error("Signup error:", error.message);
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
        await axiosInstance.post("/auth/logout");
        await removeToken(); 
        setAuthHeader(null);  
        set({ user: null, isAuthenticated: false, isLoggedIn: false });
        Toast.show({ type: "success", text1: "Logged out successfully!" });
        
    } catch (error) {
      console.error("Logout error:", error.message);
      Toast.show({ type: "error", text1: "Failed to logout" });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = await getToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoggedIn: false });
        return;
      }

      // attach token to axios and verify with backend
      setAuthHeader(token);
      const res = await axiosInstance.get("/auth/check-auth");

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoggedIn: true,
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoggedIn: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateUserProfileImage: async ({profileImage,userId}) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-image",{profileImage,userId});
      set({
        user: res.data.user, 
      });

      Toast.show({
        type: "success",
        text1: "Profile updated successfully!",
      });

      return res.data.user;
    } catch (error) {
      console.error("Update profile error:", error.message);
      Toast.show({
        type: "error",
        text1:
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateUserProfile: async (data, userId) => {
    try {
      const res = await axiosInstance.patch("/user/update-profile", { ...data, userId });
      set({
        user: res.data.user, 
      });   
      Toast.show({
        type: "success",
        text1: "Profile updated successfully!",
      });
      return res.data.user;
    } catch (error) {
      console.error("Update profile error:", error.message);
      Toast.show({
        type: "error",
        text1:
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
      });
    }
  },

  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/auth/getAllUsers");
      return res.data.users;
    } catch (error) {
      console.error("Get all users error:", error.message);
      Toast.show({
        type: "error",
        text1:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch users",
      });
    }
  },

}))