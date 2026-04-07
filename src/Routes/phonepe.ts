import { Router } from "express";
import { userJWT } from "../helper";
import { phonepeController } from "../controllers";

const router = Router();

router.post("/pay", userJWT, phonepeController.create_phonepe_payment);

export const phonepeRouter = router;
