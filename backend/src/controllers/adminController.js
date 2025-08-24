import VENDOR from "../models/vendorModel.js";


export const getVendorRequestsController  = async(req,res)=>{
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const vendors = await VENDOR.find({ status: "pending" }).select(
        "-password"
      );
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const acceptVendorRequestController = async (req, res) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const vendor = await Vendor.findById(req.params.id);
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
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

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

