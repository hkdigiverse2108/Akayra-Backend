import { Router } from "express";
import { newsletterController } from "../controllers";
const router = Router();
router.post("/subscribe", newsletterController.subscribe_newsletter);
router.delete("/:id", newsletterController.delete_newsletter_by_id);
router.get("/all", newsletterController.get_all_newsletter);
export const newsletterRouter = router;
