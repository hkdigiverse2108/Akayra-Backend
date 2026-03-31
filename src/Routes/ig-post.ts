import { Router } from "express";
import { igPostController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add", adminJWT, igPostController.add_ig_post);
router.put("/edit", adminJWT, igPostController.edit_ig_post_by_id);
router.delete("/:id", adminJWT, igPostController.delete_ig_post_by_id);
router.get("/all", userJWT, igPostController.get_all_ig_post);

export const igPostRouter = router;
