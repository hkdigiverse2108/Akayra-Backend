import { Router } from "express";
import { reviewController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add", userJWT, reviewController.add_review);
router.put("/edit", adminJWT, reviewController.edit_review_by_id);
router.delete("/:id", adminJWT, reviewController.delete_review_by_id);
router.get("/all", reviewController.get_all_review);
router.get("/:id", reviewController.get_review_by_id);

export const reviewRouter = router;
