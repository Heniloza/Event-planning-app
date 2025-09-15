// store/bookingStore.js
import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "../api/api";

export const useBookingStore = create((set) => ({
  bookings: [],

  bookService: async (data) => {
    try {
      const res = await axiosInstance.post("/booking/book", data);

      set((state) => ({
        bookings: [...state.bookings, res.data.booking],
      }));

      return res.data; 
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
    }
  },
}));
