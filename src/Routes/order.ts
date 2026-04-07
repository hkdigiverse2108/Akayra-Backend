import { Router } from "express";
import { orderController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/add", userJWT, orderController.addOrder);
router.get("/all", userJWT, orderController.getAllOrder);

export const orderRouter = router;
