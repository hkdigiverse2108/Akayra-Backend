import { Router } from "express";
import { contactController } from "../controllers";

const router = Router();

router.post("/add", contactController.add_contact);
router.put("/mark-read", contactController.mark_contact_read);
router.delete("/:id", contactController.delete_contact_by_id);
router.get("/all", contactController.get_all_contact);

export const contactRouter = router;
