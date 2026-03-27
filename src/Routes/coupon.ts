import { Router } from "express";
import { couponController } from "../controllers";

const router = Router();

router.post("/add", couponController.add_coupon);
router.post("/apply", couponController.apply_coupon);
router.put("/edit", couponController.edit_coupon_by_id);
router.delete("/:id", couponController.delete_coupon_by_id);
router.get("/all", couponController.get_all_coupon);

export const couponRouter = router;
