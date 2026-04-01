import { Router } from "express";
import { aboutController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, aboutController.add_about_section);
router.put("/edit",adminJWT, aboutController.edit_about_section_by_id);
router.delete("/:id",adminJWT, aboutController.delete_about_section_by_id);
router.get("/all", aboutController.get_all_about_sections);
router.get("/:id",userJWT, aboutController.get_about_section_by_id);

export const aboutRouter = router;
