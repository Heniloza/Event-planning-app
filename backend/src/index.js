import express from "express"
import {config} from "dotenv"
config();
import connectDB from "./config/dbConnection.js"
import authRoutes from "./routes/authRoutes.js"
import vendorAuthRoutes from "./routes/vendorAuthRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import vendorPackageRoutes from "./routes/vendorPackageRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import cors from "cors"
import BOOKING from "./models/bookingModel.js";
import sendReminder from "./utils/sendReminder.js";
import VENDOR from "./models/vendorModel.js";

const app = express()
const PORT = process.env.PORT || 3000

connectDB(process.env.MONGO_URI)
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((err) => console.log("Error in connection database", err));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


app.use("/api/auth",authRoutes) // http:localhost:3000/api/auth
app.use("/api/vendor",vendorAuthRoutes)//http:localhost:3000/api/vendor
app.use("/api/admin",adminRoutes)//http:localhost:3000/api/admin/report
app.use("/api/vendor/package",vendorPackageRoutes)//http:localhost:3000/api/vendor/package
app.use("/api/user",userRoutes)//http:localhost:3000/api/user/report
app.use("/api/booking",bookingRoutes)//http:localhost:3000/api/book
app.use("/api/notification",notificationRoutes)//http:localhost:3000/api/notification


app.get("/", (req, res) => {
  res.send("API is running....");
})

app.get("/test-reminder", async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);

    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

    const bookings = await BOOKING.find({
      eventDate: { $gte: startOfDay, $lte: endOfDay },
      status: "confirmed",
    });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No confirmed bookings found for tomorrow." });
    }

    for (const booking of bookings) {
      const vendor = await VENDOR.findById(booking.vendorId);
      if (vendor?.email) {
        await sendReminder(vendor.email, booking);
      }
    }

    res.json({ message: "Reminders sent successfully!" });
  } catch (error) {
    console.error("Reminder test error:", error);
    res.status(500).json({ message: "Error sending reminders", error });
  }
});

// app.listen(PORT, "0.0.0.0", () =>
//   console.log(`SERVER STARTED AT ${PORT}`)
// );

export default app;