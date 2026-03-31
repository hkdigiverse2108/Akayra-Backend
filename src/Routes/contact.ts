import { Router } from "express";
import { contactController } from "../controllers";
import { adminJWT } from "../helper";

const router = Router();

router.post("/add", contactController.add_contact);
router.put("/mark-read", adminJWT, contactController.mark_contact_read);
router.delete("/:id", adminJWT, contactController.delete_contact_by_id);
router.get("/all", adminJWT, contactController.get_all_contact);

export const contactRouter = router;
