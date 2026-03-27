import { Router } from "express";
import { faqController } from "../controllers";
const router = Router();

// FAQ Category
router.post("/category/add", faqController.add_faq_category);
router.put("/category/edit", faqController.edit_faq_category_by_id);
router.delete("/category/:id", faqController.delete_faq_category_by_id);
router.get("/category/all", faqController.get_all_faq_category);
// FAQ
router.post("/add", faqController.add_faq);
router.put("/edit", faqController.edit_faq_by_id);
router.delete("/:id", faqController.delete_faq_by_id);
router.get("/all", faqController.get_all_faq);
router.get("/:id", faqController.get_faq_by_id);

export const faqRouter = router;
