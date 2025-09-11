import express from "express"
import { verifyOtpController } from "../controllers/otpController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { checkAuth, loginController, logoutController, signupController, updateProfileController } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup",signupController)
router.post("/login",loginController)
router.post("/logout", logoutController);
router.post("/update-profile",updateProfileController);
router.get("/check-auth",  checkAuth);

router.post("/verify", verifyOtpController);

export default router
