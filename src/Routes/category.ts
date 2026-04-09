import { Router } from "express";
import { categoryController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, categoryController.add_category);
router.put("/edit",adminJWT, categoryController.edit_category_by_id);
router.delete("/:id",adminJWT, categoryController.delete_category_by_id);
router.get("/all", categoryController.get_all_category);
router.get("/:id", categoryController.get_category_by_id);

export const categoryRouter = router;
