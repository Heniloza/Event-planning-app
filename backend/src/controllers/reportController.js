import REPORT from "../models/reportsModel.js";

export const createReportController = async (req, res) => {
  try {
    const { userId, description } = req.body;

    if (!userId|| !description) {
      return res.status(400).json({
        success: false,
        message: "userId and description are required",
      });
    }

    const newReport = await REPORT.create({
      userId,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report: newReport,
    });
    
  } catch (error) {
    console.error("Error creating report:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating report",
    });
  }
};

export const getAllReportsController = async (req, res) => {
  try {
    const reports = await REPORT.find()
    .populate("userId", "name email profileImage")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching reports",
    });
  }
};

export const markReportAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await REPORT.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Report marked as read",
      report,
    });
  } catch (error) {
    console.error("Error marking report as read:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating report",
    });
  }
};

