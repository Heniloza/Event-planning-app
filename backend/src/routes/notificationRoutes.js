import {Router} from "express"
import { createNotificationController, getUserNotificationsController, getVendorNotificationsController } from "../controllers/notificationController.js";

const router = Router();

router.post("/create",createNotificationController)
router.get("/user/:userId",getUserNotificationsController)
router.get("/vendor/:vendorId",getVendorNotificationsController)


export default router;