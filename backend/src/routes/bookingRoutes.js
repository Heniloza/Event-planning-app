import express from "express";
import { bookServiceController, fetchUserBookingsController, fetchVendorBookingsController, updateBookingStatusController, updateServiceStatusController } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookServiceController);
router.get("/fetchVendorBookings/:vendorId", fetchVendorBookingsController);
router.post("/booking/update-status", updateBookingStatusController);
router.patch("/:bookingId/update-service-status",updateServiceStatusController);
router.get("/fetchUserBookings/:userId",fetchUserBookingsController);

export default router;