import { Router } from "express";
import { authController } from "../controllers";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgot_password);
router.post("/reset-password", authController.reset_password);
router.post("/verify-otp", authController.otp_verification);

export const authRouter = router;
