import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../api/api";
import Toast from "react-native-toast-message";

export const useBookingStore = create((set) => ({
  bookings: [],
  userBookings:[],

  bookService: async (data) => {
    try {
      const res = await axiosInstance.post("/booking/book", data);

      set((state) => ({
        bookings: [...state.bookings, res.data.data],
      }));
      Toast.show({
        type: "success",
        text1: "Package Booked successfully",
      });
      return res.data;
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
    }
  },

  fetchVendorBookings: async (vendorId) => {
    try {
      const res = await axiosInstance.get(
        `/booking/fetchVendorBookings/${vendorId}`,
        {
          vendorId,
        }
      );

      set({ bookings: res.data.data });
      console.log(res.data.data, "data ");
      return res.data.data;
    } catch (err) {
      console.error(
        "Fetch vendor bookings error:",
        err.response?.data || err.message
      );
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const res = await axiosInstance.post("/booking/update-status", {
        bookingId,
        status,
      });

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? { ...b, status: res.data.data.status } : b
        ),
      }));

      return res.data;
    } catch (err) {
      console.error(
        "Update booking status error:",
        err.response?.data || err.message
      );
    }
  },

  updateServiceStatus: async (bookingId, serviceType, status) => {
    try {
      const res = await axiosInstance.patch(
        `/booking/${bookingId}/update-service-status`,
        { serviceType, status }
      );
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? res.data.booking : b
        ),
      }));
      
     Toast.show({
       type: "success",
       text1: res.data.message,
     });

      return res.data;
    } catch (error) {
      console.error("Error updating service status:");
      Toast.show({
        type: "error",
        text1: error?.response?.data.message,
        text2:error?.response?.data?.error
      });
    }
  },

  fetchUserBookings: async (userId) => {
    try {
      const res = await axiosInstance.get(
        `/booking/fetchUserBookings/${userId}`
      );
      set({ userBookings: res.data.data });
      console.log(res.data.data, "user bookings data ");
      
      return res.data.data; 
    } catch (err) {
      console.error(
        "Fetch user bookings error:",
        err.response?.data || err.message
      );
    }
  },

}));
