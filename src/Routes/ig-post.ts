import { Router } from "express";
import { igPostController } from "../controllers";
const router = Router();
router.post("/add", igPostController.add_ig_post);
router.put("/edit", igPostController.edit_ig_post_by_id);
router.delete("/:id", igPostController.delete_ig_post_by_id);
router.get("/all", igPostController.get_all_ig_post);
export const igPostRouter = router;
