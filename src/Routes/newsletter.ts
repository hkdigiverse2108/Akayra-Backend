import { Router } from "express";
import { newsletterController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/subscribe",userJWT, newsletterController.subscribe_newsletter);
router.delete("/:id", adminJWT, newsletterController.delete_newsletter_by_id);
router.get("/all", adminJWT, newsletterController.get_all_newsletter);

export const newsletterRouter = router;
