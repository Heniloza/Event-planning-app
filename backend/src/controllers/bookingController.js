import BOOKING from "../models/bookingModel.js";
import PACKAGE from "../models/packageModel.js";



export const bookServiceController = async (req, res) => {
  try {
    const { userId, packageId, eventDate, guests } = req.body;

    if (!userId || !packageId || !eventDate || !guests) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find package with vendors
    const pkg = await PACKAGE.findById(packageId)
      .populate("venue")
      .populate("decorator")
      .populate("caterer");

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Extract vendors
    const vendors = [
      pkg.venue?._id,
      pkg.decorator?._id,
      pkg.caterer?._id,
    ].filter(Boolean);

    // Calculate total price
    const totalPrice =
      (pkg.venue?.price || 0) +
      (pkg.decorator?.price || 0) +
      (pkg.caterer?.price || 0);

    // Create booking
    const newBooking = await BOOKING.create({
      userId,
      packageId,
      vendors,
      eventDate,
      guests,
      totalPrice,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error in bookServiceController:", error);
    res.status(500).json({ message: "Server error in booking service" });
  }
};


export const fetchVendorBookingsController = async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const bookings = await BOOKING.find({ vendors: vendorId })
      .populate("userId", "name email phone") 
      .populate("packageId", "name price services_included") 
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this vendor" });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error in fetchBookingsForVendor:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};