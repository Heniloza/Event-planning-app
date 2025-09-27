import NOTIFICATION from "../models/notificationModel.js";

export const createNotificationController = async (req, res) => {
  try {
    const { userId, vendorId, title, message, type } = req.body;

    if(!userId || !vendorId || !title || !message || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const notification = await NOTIFICATION.create({
      userId,
      vendorId,
      title,
      message,
      type,
    });;

    res.status(201).json({
      success: true,
      data: notification,
      message: "Notification created successfully",
    });

  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserNotificationsController = async (req, res) => {
  try { 
    const { userId } = req.params;

    if(!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const notifications = await NOTIFICATION.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getVendorNotificationsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if(!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    const notifications = await NOTIFICATION.find({ vendorId: vendorId }).sort(
      { createdAt: -1 }
    );

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};