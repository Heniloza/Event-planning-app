import BOOKING from "../models/bookingModel.js";
import PACKAGE from "../models/packageModel.js";
import VENDOR from "../models/vendorModel.js";




export const bookServiceController = async (req, res) => {
  try {
    const { userId, eventDate, services, totalPrice, serviceDetails } =
      req.body;

    if (!userId || !eventDate || !services || !totalPrice) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["userId", "eventDate", "services", "totalPrice"],
      });
    }

    const vendors = [
      services?.Venue?._id,
      services?.Decorator?._id,
      services?.Caterer?._id,
    ].filter(Boolean);

    if (vendors.length === 0) {
      return res.status(400).json({ message: "At least one service required" });
    }

    let guests = 0;
    if (services?.Venue?.guestCount) {
      guests = parseInt(services.Venue.guestCount) || 0;
    } else if (services?.Caterer?.guestCount) {
      guests = parseInt(services.Caterer.guestCount) || 0;
    }

    const newBooking = await BOOKING.create({
      userId,
      vendors,
      eventDate: new Date(eventDate),
      guests,
      totalPrice,
      serviceDetails: {
        venue: services?.Venue
          ? {
              packageId: services.Venue._id,
              guestCount: serviceDetails?.venue?.guestCount ?? 0,
              budget: serviceDetails?.venue?.budget ?? 0,
            }
          : null,
        decorator: services?.Decorator
          ? {
              packageId: services.Decorator._id,
              theme: serviceDetails?.decorator?.theme ?? null,
              budget: serviceDetails?.decorator?.budget ?? 0,
            }
          : null,
        caterer: services?.Caterer
          ? {
              packageId: services.Caterer._id,
              guestCount: serviceDetails?.caterer?.guestCount ?? 0,
              budget: serviceDetails?.caterer?.budget ?? 0,
              meals: serviceDetails?.caterer?.meals ?? [],
            }
          : null,
      },
    });

    return res.status(201).json({
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error in bookServiceController:", error);
    res.status(500).json({
      message: "Server error in booking service",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const fetchVendorBookingsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    console.log("Received vendorId:", vendorId);

    if (!vendorId || vendorId === "undefined") {
      return res.status(400).json({ message: "Valid Vendor ID is required" });
    }

    // Get vendor info - include more fields to check vendor type
    const vendor = await VENDOR.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    console.log("Vendor found:", vendor);
    console.log("Vendor type:", vendor.type);

    // Check if vendor has type field, if not, try to determine from business type or other field
    let vendorType = vendor.type;
    if (!vendorType && vendor.businessType) {
      vendorType = vendor.businessType;
    }
    if (!vendorType && vendor.category) {
      vendorType = vendor.category;
    }

    if (!vendorType) {
      console.log("Available vendor fields:", Object.keys(vendor.toObject()));
      return res.status(400).json({
        message: "Vendor type not found",
        availableFields: Object.keys(vendor.toObject()),
      });
    }

    // Get vendor's packages
    const packages = await PACKAGE.find({ vendor: vendorId });
    const packageIds = packages.map((pkg) => pkg._id.toString());

    console.log("Package IDs:", packageIds);

    if (packageIds.length === 0) {
      return res.status(404).json({ message: "No packages found" });
    }

    // Find bookings - make sure to get all fields including serviceDetails
    const bookings = await BOOKING.find({ vendors: { $in: packageIds } })
      .populate("userId", "name email phone")
      .lean() // Use lean for better performance and to ensure we get all fields
      .sort({ createdAt: -1 });

    console.log("Found bookings:", bookings.length);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Debug: Check if serviceDetails exists
    bookings.forEach((booking) => {
      console.log(`Booking ${booking._id}:`);
      console.log("- serviceDetails exists:", !!booking.serviceDetails);
      if (booking.serviceDetails) {
        console.log("- venue:", !!booking.serviceDetails.venue);
        console.log("- decorator:", !!booking.serviceDetails.decorator);
        console.log("- caterer:", !!booking.serviceDetails.caterer);
      }
    });

    // Format response based on vendor type
    const finalVendorType = vendorType.toLowerCase();
    console.log("Processing with vendor type:", finalVendorType);
    const result = bookings.map((booking) => {
      let serviceDetails = null;

      if (booking.serviceDetails) {
        if (finalVendorType === "venue" && booking.serviceDetails.venue) {
          serviceDetails = booking.serviceDetails.venue;
        } else if (
          finalVendorType === "decorator" &&
          booking.serviceDetails.decorator
        ) {
          serviceDetails = booking.serviceDetails.decorator;
        } else if (
          finalVendorType === "caterer" &&
          booking.serviceDetails.caterer
        ) {
          serviceDetails = booking.serviceDetails.caterer;
        }
      }

      console.log(`Booking ${booking._id} - vendorService:`, serviceDetails);

      return {
        _id: booking._id,
        userId: booking.userId,
        eventDate: booking.eventDate,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
        vendorService: serviceDetails,
      };
    });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
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