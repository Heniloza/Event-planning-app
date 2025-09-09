import express from "express";
import {   getAllVendorsController, updateVendorProfileController, updateVendorProfileImageController, vendorLoginController, vendorLogoutController, vendorSignupController } from "../controllers/vendorAuthController.js";

const router = express.Router();

router.post("/signup", vendorSignupController);
router.post("/login", vendorLoginController);
router.post("/logout", vendorLogoutController);
router.post("/update-profile", updateVendorProfileImageController);
router.patch("/update", updateVendorProfileController);
router.get("/getAll",getAllVendorsController)

export default router;