import BOOKING from "../models/bookingModel.js";
import PACKAGE from "../models/packageModel.js";
import VENDOR from "../models/vendorModel.js";
import mongoose from "mongoose";

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

    if (!vendorId || vendorId === "undefined") {
      return res.status(400).json({ message: "Valid Vendor ID is required" });
    }

    const vendor = await VENDOR.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    let vendorType = vendor.type || vendor.businessType || vendor.category;
    if (!vendorType) {
      return res.status(400).json({
        message: "Vendor type not found",
        availableFields: Object.keys(vendor.toObject()),
      });
    }

    // Get all packages for this vendor
    const packages = await PACKAGE.find({ vendor: vendorId });
    if (packages.length === 0) {
      return res.status(404).json({ message: "No packages found" });
    }
    const packageIds = packages.map(
      (pkg) => new mongoose.Types.ObjectId(pkg._id)
    );

    // Fetch all bookings that contain ANY of the vendor's packageIds in serviceDetails
    const bookings = await BOOKING.find({
      $or: [
        { "serviceDetails.venue.packageId": { $in: packageIds } },
        { "serviceDetails.decorator.packageId": { $in: packageIds } },
        { "serviceDetails.caterer.packageId": { $in: packageIds } },
      ],
    })
      .populate("userId", "name email phone")
      .lean()
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Map bookings to include vendorServices
    const result = bookings.map((booking) => {
      const vendorServices = [];
      const { venue, decorator, caterer } = booking.serviceDetails || {};

      if (venue) {
        vendorServices.push({
          type: "venue",
          ...venue,
          belongsToVendor: packageIds.some(
            (id) => id.toString() === venue.packageId?.toString()
          ),
        });
      }
      if (decorator) {
        vendorServices.push({
          type: "decorator",
          ...decorator,
          belongsToVendor: packageIds.some(
            (id) => id.toString() === decorator.packageId?.toString()
          ),
        });
      }
      if (caterer) {
        vendorServices.push({
          type: "caterer",
          ...caterer,
          belongsToVendor: packageIds.some(
            (id) => id.toString() === caterer.packageId?.toString()
          ),
        });
      }

      return {
        _id: booking._id,
        userId: booking.userId,
        eventDate: booking.eventDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
        vendorServices,
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

export const updateServiceStatusController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { serviceType, status } = req.body;

    if (!["venue", "decorator", "caterer"].includes(serviceType)) {
      return res.status(400).json({ message: "Invalid service type" });
    }

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateField = `serviceDetails.${serviceType}.status`;

    const updatedBooking = await BOOKING.findByIdAndUpdate(
      bookingId,
      { [updateField]: status },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: `${serviceType} status updated successfully`,
      booking: updatedBooking, // Make sure to return 'booking' not 'updatedBooking'
    });
  } catch (err) {
    console.error("Error updating service status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const fetchUserBookingsController = async (req, res) => {
  try {
    const {userId} = req.params;

    const bookings = await BOOKING.find({ userId })
      .populate({
        path: "vendors",
        model: "Package",
        populate: {
          path: "vendor",
          model: "Vendor",
        },
      })
      .exec();

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bookings found" });
    }

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};