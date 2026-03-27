import { Router } from "express";
import { sizeController } from "../controllers";
const router = Router();
router.post("/add", sizeController.add_size);
router.put("/edit", sizeController.edit_size_by_id);
router.delete("/:id", sizeController.delete_size_by_id);
router.get("/all", sizeController.get_all_size);
router.get("/:id", sizeController.get_size_by_id);
export const sizeRouter = router;
