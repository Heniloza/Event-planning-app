import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    business_name: {
      type: String,
      required: true,
      trim: true,
    },
    owner_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Caterer", "Decorator", "Venue", "All"],
    },
    location: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    isBusinessVerified: {
      type: String,
      enum: ["not_requested", "pending", "fulfilled"],
      default: "not_requested",
    },
  },
  { timestamps: true }
);

const VENDOR = mongoose.model("Vendor", vendorSchema);

export default VENDOR
