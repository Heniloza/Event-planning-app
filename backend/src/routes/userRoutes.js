import { updateUserProfileController } from "../controllers/authController.js";
import express from "express"
import { createReportController } from "../controllers/reportController.js";

const router = express.Router()

router.patch("/update-profile",updateUserProfileController)
router.post("/report",createReportController)

export default router