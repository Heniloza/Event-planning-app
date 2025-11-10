import express from "express"
import {authMiddleware} from "../middleware/authMiddleware.js"
import { acceptVendorRequestController, getVendorRequestsController, rejectVendorRequestController } from "../controllers/adminController.js"
import { getAllReportsController, markReportAsReadController } from "../controllers/reportController.js"
import { deleteUserController } from "../controllers/authController.js"

const router = express.Router()

router.get("/requests", getVendorRequestsController);
router.put("/accept/:id",acceptVendorRequestController)
router.put("/reject/:id",rejectVendorRequestController)
router.put("/report/read/:id",markReportAsReadController)
router.post("/delete", deleteUserController);

router.get("/reports",getAllReportsController)

export default router