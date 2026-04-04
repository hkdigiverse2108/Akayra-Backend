import { Router } from "express";
import { faqController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, faqController.add_faq);
router.put("/edit",adminJWT, faqController.edit_faq_by_id);
router.delete("/:id",adminJWT, faqController.delete_faq_by_id);
router.get("/all", faqController.get_all_faq);
router.get("/:id", faqController.get_faq_by_id);

export const faqRouter = router;
