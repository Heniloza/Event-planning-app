import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  vendorId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }], 
  title: String,
  message: String,
  type: { type: String, enum: ["booking","reminder"] },
},{timestamps: true});

const NOTIFICATION = mongoose.model("Notification", notificationSchema);

export default NOTIFICATION
