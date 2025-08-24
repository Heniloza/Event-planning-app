import {Router} from "express"
import { checkAuth, loginController, logoutController, signupController, updateProfileController } from "../controllers/authController.js"
import { verifyOtpController } from "../controllers/otpController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = Router()

router.post("/signup",signupController)
router.post("/login",loginController)
router.post("/logout", logoutController);
router.post("/update-profile",authMiddleware, updateProfileController);
router.get("/check-auth",  checkAuth);

router.post("/verify", verifyOtpController);

export default router
