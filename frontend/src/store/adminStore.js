import { create } from "zustand";
import { axiosInstance } from "../api/api";
import Toast from "react-native-toast-message";

export const useAdminStore = create((set,get) => ({
  vendorRequests: [],
  reports:[],

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
      set({ reports: res?.data.reports});
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch reports");
    }
  },
}));