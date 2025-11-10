import VENDOR from "../models/vendorModel.js";
import USER from "../models/userModel.js";


export const getVendorRequestsController  = async(req,res)=>{
    try {
      const vendors = await VENDOR.find({ status: "pending" }).select(
        "-password"
      );
      res.status(200).json({message:"Request fetched successfully",vendors});
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const acceptVendorRequestController = async (req, res) => {
    try {
      const vendor = await VENDOR.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      vendor.status = "approved";
      await vendor.save();

      res.json({ message: "Vendor request accepted", vendor });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

export  const rejectVendorRequestController = async (req, res) => {
    try {
      const vendor = await VENDOR.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      vendor.status = "rejected";
      await vendor.save();

      res.json({ message: "Vendor request rejected", vendor });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

