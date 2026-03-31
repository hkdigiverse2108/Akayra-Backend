import { Router } from "express";
import { cartController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.use(userJWT)
router.post("/add",  cartController.add_to_cart);
router.put("/update", cartController.update_cart_item);
router.put("/clear", cartController.clear_cart);
router.get("/", cartController.get_cart);

export const cartRouter = router;
