import express from "express";
import { updateVendorProfileController, vendorLoginController, vendorLogoutController, vendorSignupController } from "../controllers/vendorAuthController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", vendorSignupController);
router.post("/login", vendorLoginController);
router.post("/logout", vendorLogoutController);
router.post("/update-profile", authMiddleware, updateVendorProfileController);

export default router;