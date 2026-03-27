import { Router } from "express";
import { colorController } from "../controllers";

const router = Router();

router.post("/add", colorController.add_color);
router.put("/edit", colorController.edit_color_by_id);
router.delete("/:id", colorController.delete_color_by_id);
router.get("/all", colorController.get_all_color);
router.get("/:id", colorController.get_color_by_id);

export const colorRouter = router;
