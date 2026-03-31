import { Router } from "express";
import { couponController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, couponController.add_coupon);
router.post("/apply",userJWT, couponController.apply_coupon);
router.put("/edit",adminJWT, couponController.edit_coupon_by_id);
router.delete("/:id",adminJWT, couponController.delete_coupon_by_id);
router.get("/all",adminJWT, couponController.get_all_coupon);

export const couponRouter = router;
