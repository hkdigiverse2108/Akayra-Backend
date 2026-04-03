import { Router } from "express";
import { authController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgot_password);
router.post("/reset-password", authController.reset_password);
router.post("/verify-otp", authController.otp_verification);
router.post("/change-password", userJWT, authController.change_password);

export const authRouter = router;
