import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../api/api";
import Toast from "react-native-toast-message";

export const useBookingStore = create((set) => ({
  bookings: [],

  bookService: async (data) => {
    try {
      const res = await axiosInstance.post("/booking/book", data);

      set((state) => ({
        bookings: [...state.bookings, res.data.data],
      }));
       Toast.show({
         type: "success",
         text1: "Package created successfully",
       });
      return res.data;
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
    }
  },

  fetchVendorBookings: async (vendorId) => {
    try {
      const res = await axiosInstance.get(`/booking/fetchVendorBookings/${vendorId}`, {
        vendorId,
      });

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
  
}));
