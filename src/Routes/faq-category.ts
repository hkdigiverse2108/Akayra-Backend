import { Router } from "express";
import { faqCategoryController } from "../controllers";
import { adminJWT, userJWT } from "../helper";
const router = Router();

router.post("/add",adminJWT, faqCategoryController.add_faq_category);
router.put("/edit",adminJWT, faqCategoryController.edit_faq_category_by_id);
router.delete("/:id",adminJWT, faqCategoryController.delete_faq_category_by_id);
router.get("/all",userJWT, faqCategoryController.get_all_faq_category);

export const faqCategoryRouter = router;
