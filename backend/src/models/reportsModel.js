import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    read:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const REPORT = mongoose.model("report", reportSchema);
export default REPORT;
