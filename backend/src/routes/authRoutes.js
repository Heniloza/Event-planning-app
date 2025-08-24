import {Router} from "express"
import { checkAuth, loginController, logoutController, signupController, updateProfileController } from "../controllers/authController.js"
import { verifyOtpController } from "../controllers/otpController.js"

const router = Router()

router.post("/signup",signupController)
router.post("/login",loginController)
router.post("/logout", logoutController);
router.post("/update-profile", updateProfileController);
router.get("/check-auth",  checkAuth);

//Otp generate and verify  routes
router.post("/verify", verifyOtpController);

export default router
