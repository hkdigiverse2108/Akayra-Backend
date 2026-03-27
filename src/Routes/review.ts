import { Router } from "express";
import { reviewController } from "../controllers";

const router = Router();

router.post("/add", reviewController.add_review);
router.put("/edit", reviewController.edit_review_by_id);
router.delete("/:id", reviewController.delete_review_by_id);
router.get("/all", reviewController.get_all_review);
router.get("/:id", reviewController.get_review_by_id);

export const reviewRouter = router;
