import express from "express";
import { bookServiceController, fetchVendorBookingsController } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookServiceController);
router.get("/fetchVendorBookings", fetchVendorBookingsController);

export default router;