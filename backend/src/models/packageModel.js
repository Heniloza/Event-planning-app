import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", 
      required: true,
    },
    name: { type: String, required: true }, 
    description: { type: String },
    price: { type: Number, required: true },
    services_included: [{ type: String }], 
    image: { type: String, default: "" }, 
  },
  { timestamps: true }
);

const PACKAGE = mongoose.model("Package", packageSchema);

export default PACKAGE;
