import cron from "node-cron";
import BOOKING from "../models/Booking.js";
import VENDOR from "../models/Vendor.js";
import sendReminder from "./sendReminder.js";

cron.schedule("0 9 * * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
  const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

  const bookings = await BOOKING.find({
    eventDate: { $gte: startOfDay, $lte: endOfDay },
    status: "confirmed",
  });

  for (const booking of bookings) {
    const vendor = await VENDOR.findById(booking.vendorId);
    if (vendor?.email) {
      await sendReminder(vendor.email, booking);
    }
  }
});
  