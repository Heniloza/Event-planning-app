import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../api/api";

export const useBookingStore = create((set) => ({
  bookings: [],

  bookService: async (data) => {
    try {
      const res = await axiosInstance.post("/booking/book", data);

      set((state) => ({
        bookings: [...state.bookings, res.data.data],
      }));

      return res.data;
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
    }
  },

  fetchVendorBookings: async (vendorId) => {
    try {
      const res = await axiosInstance.post("/booking/fetchVendorBookings", {
        vendorId,
      });

      set({ bookings: res.data.data });
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

      // Update the specific booking in local state
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
