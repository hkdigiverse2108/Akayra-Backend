import { Router } from "express";
import { faqCategoryController } from "../controllers";
const router = Router();

router.post("/add", faqCategoryController.add_faq_category);
router.put("/edit", faqCategoryController.edit_faq_category_by_id);
router.delete("/:id", faqCategoryController.delete_faq_category_by_id);
router.get("/all", faqCategoryController.get_all_faq_category);

export const faqCategoryRouter = router;
