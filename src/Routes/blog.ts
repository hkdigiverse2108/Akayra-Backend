import { Router } from "express";
import { blogController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, blogController.add_blog);
router.put("/edit",adminJWT, blogController.edit_blog_by_id);
router.delete("/:id",adminJWT, blogController.delete_blog_by_id);
router.get("/all", blogController.get_all_blog);
router.get("/:id", blogController.get_blog_by_id);

export const blogRouter = router;
