import mongoose from "mongoose";

const packageHistorySchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    services_included: { type: [String], default: [] },
    image: { type: String, default: "" },
    policies: { type: String, default: "" },
    theme: { type: String, default: "" },
  },
  { timestamps: true }
);

const PACKAGEHISTORY = mongoose.model("PackageHistory", packageHistorySchema);

export default PACKAGEHISTORY;
