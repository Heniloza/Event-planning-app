import { create } from "zustand";
import { axiosInstance } from "../api/api";
import Toast from "react-native-toast-message";



export const useNotificationStore = create((set) => ({
  notifications: [],

  fetchUserNotifications: async (userId) => {
    try {
      const res = await axiosInstance.get(`/notification/user/${userId}`);
      set({ notifications: res.data.data });
    } catch (error) {
      console.error("Error fetching user notifications:", error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to fetch notifications",
      });
    }
  },

  fetchVendorNotifications: async (vendorId) => {
    try {
      const res = await axiosInstance.get(`/notification/vendor/${vendorId}`);
      set({ notifications: res.data.data });
    } catch (error) {
      console.error("Error fetching vendor notifications:", error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to fetch notifications",
      });
    }
  },

  createNotification: async (data) => {
    try {
      const res = await axiosInstance.post("/notification/create", data);
      set((state) => ({
        notifications: [res.data.data, ...state.notifications],
      }));
      console.log("Notification created:", res.data.data);
      
    } catch (error) {
      console.error("Error creating notification:", error.message);
    }
  },
  
}));