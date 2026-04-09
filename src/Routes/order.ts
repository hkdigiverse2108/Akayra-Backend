import { Router } from "express";
import { orderController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/add", orderController.addOrder);
router.get("/all", userJWT, orderController.getAllOrder);
router.get("/:id", userJWT, orderController.getOrderById);

export const orderRouter = router;
