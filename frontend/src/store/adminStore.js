import { create } from "zustand";
import { axiosInstance } from "../api/api";
import Toast from "react-native-toast-message";

export const useAdminStore = create((set, get) => ({
  vendorRequests: [],
  reports: [],

  fetchVendorRequests: async () => {
    try {
      const res = await axiosInstance.get("/admin/requests");
      set({ vendorRequests: res?.data.vendors });
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch requests");
    }
  },

  approveVendorRequest: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/accept/${id}`);
      set({
        vendorRequests: get().vendorRequests.filter((req) => req._id !== id),
      });
      Toast.show({
        type: "success",
        text1: "Vendor approved",
      });
      return res.data;
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to approve request");
    }
  },

  rejectVendorRequest: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/reject/${id}`);
      set({
        vendorRequests: get().vendorRequests.filter((req) => req._id !== id),
      });
      Toast.show({
        type: "success",
        text1: "Vendor Request rejected",
      });
      return res.data;
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to reject request");
    }
  },

  fetchReports: async () => {
    try {
      const res = await axiosInstance.get("/admin/reports");
      set({ reports: res?.data.reports });
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch reports");
    }
  },

  markReportAsRead: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/report/read/${id}`);

      set({
        reports: get().reports.map((r) =>
          r._id === id ? { ...r, read: true } : r
        ),
      });

      Toast.show({
        type: "success",
        text1: "Report marked as read",
      });

      return res.data;
    } catch (error) {
      console.log(
        error.response?.data?.message || "Failed to mark report as read"
      );
      Toast.show({
        type: "error",
        text1: "Failed to update report",
      });
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await axiosInstance.post(`/admin/delete`, { userId });
      console.log("User deleted:", res.data);
      Toast.show({ type: "success", text1: "User deleted successfully!" });
    } catch (error) {
      console.log(
        "Error deleting user:",
        error.response?.data || error.message
      );
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to delete user",
      });
    }
  },

}));