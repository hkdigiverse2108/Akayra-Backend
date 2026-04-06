import { Router } from "express";
import { orderController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/add", userJWT, orderController.addOrder);

export const orderRouter = router;
