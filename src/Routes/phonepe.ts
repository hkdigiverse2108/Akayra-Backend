import { Router } from "express";
import { userJWT } from "../helper";
import { phonepeController } from "../controllers";

const router = Router();

router.post("/pay", userJWT, phonepeController.create_phonepe_payment);
router.post("/callback", phonepeController.phonepe_callback);

export const phonepeRouter = router;
