import express from "express";
import {  updateVendorProfileController, updateVendorProfileImageController, vendorLoginController, vendorLogoutController, vendorSignupController } from "../controllers/vendorAuthController.js";

const router = express.Router();

router.post("/signup", vendorSignupController);
router.post("/login", vendorLoginController);
router.post("/logout", vendorLogoutController);
router.post("/update-profile", updateVendorProfileImageController);
router.patch("/update", updateVendorProfileController);

export default router;