import { Router } from "express";
import { razorpayController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/pay", userJWT, razorpayController.create_razorpay_payment);
router.post("/verify", userJWT, razorpayController.razorpay_verify_payment);

export const razorpayRouter = router;
