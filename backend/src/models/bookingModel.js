import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package", // the selected package/service IDs
      },
    ],
    eventDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    serviceDetails: {
      venue: {
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
        guestCount: { type: Number },
        budget: { type: Number },
      },
      decorator: {
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
        theme: { type: String },
        budget: { type: Number },
      },
      caterer: {
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
        guestCount: { type: Number },
        budget: { type: Number },
        meals: [{ type: String }],
      },
    },
  },
  { timestamps: true }
);

const BOOKING = mongoose.model("Booking", bookingSchema);
export default BOOKING;
