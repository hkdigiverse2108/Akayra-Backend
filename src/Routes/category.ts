import { Router } from "express";
import { categoryController } from "../controllers";

const router = Router();

router.post("/add", categoryController.add_category);
router.put("/edit", categoryController.edit_category_by_id);
router.delete("/:id", categoryController.delete_category_by_id);
router.get("/all", categoryController.get_all_category);
router.get("/:id", categoryController.get_category_by_id);

export const categoryRouter = router;
