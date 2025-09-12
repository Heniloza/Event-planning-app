import express from "express"
import {authMiddleware} from "../middleware/authMiddleware.js"
import { acceptVendorRequestController, getVendorRequestsController, rejectVendorRequestController } from "../controllers/adminController.js"
import { getAllReportsController } from "../controllers/reportController.js"

const router = express.Router()

router.get("/requests",authMiddleware,getVendorRequestsController)
router.put("/accept/:id",authMiddleware,acceptVendorRequestController)
router.put("/reject/:id",authMiddleware,rejectVendorRequestController)

router.get("/reports",getAllReportsController)

export default router