import BOOKING from "../models/bookingModel.js";
import PACKAGE from "../models/packageModel.js";



export const bookServiceController = async (req, res) => {
  try {
   const { userId, eventDate, guests, services,totalPrice} = req.body;

   if (!userId || !eventDate || !guests || !services || !totalPrice) {
     return res.status(400).json({ message: "All fields are required" });
   }

   

   const vendors = [
     services?.Venue?._id,
     services?.Decorator?._id,
     services?.Caterer?._id,
   ].filter(Boolean);

    const newBooking = await BOOKING.create({
      userId,
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

   const bookings = await BOOKING.find({ vendors: { $in: [vendorId] } })
     .populate("userId", "name email phone")
     .populate("vendors", "name email")
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
    console.error("Error in fetchVendorBookingsController:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};

export const updateBookingStatusController = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res
        .status(400)
        .json({ message: "Booking ID and status are required" });
    }

    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await BOOKING.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
      .populate("userId", "name email phone")
      .populate("vendors", "business_name owner_name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: `Booking ${status} successfully`,
      data: booking,
    });
  } catch (error) {
    console.error("Error in updateBookingStatusController:", error);
    res.status(500).json({ message: "Server error while updating booking" });
  }
};