import { Router } from "express";
import { faqController } from "../controllers";

const router = Router();

router.post("/add", faqController.add_faq);
router.put("/edit", faqController.edit_faq_by_id);
router.delete("/:id", faqController.delete_faq_by_id);
router.get("/all", faqController.get_all_faq);
router.get("/:id", faqController.get_faq_by_id);

export const faqRouter = router;
