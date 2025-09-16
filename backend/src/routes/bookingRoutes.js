import express from "express";
import { bookServiceController, fetchVendorBookingsController, updateBookingStatusController } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookServiceController);
router.get("/fetchVendorBookings", fetchVendorBookingsController);
router.post("/booking/update-status", updateBookingStatusController);

export default router;