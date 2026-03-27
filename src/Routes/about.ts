import { Router } from "express";
import { aboutController } from "../controllers";

const router = Router();

router.post("/add", aboutController.add_about_section);
router.put("/edit", aboutController.edit_about_section_by_id);
router.delete("/:id", aboutController.delete_about_section_by_id);
router.get("/all", aboutController.get_all_about_sections);
router.get("/:id", aboutController.get_about_section_by_id);

export const aboutRouter = router;
