import { Router } from "express";
import { brandController } from "../controllers";
import { adminJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, brandController.add_brand);
router.put("/edit",adminJWT, brandController.edit_brand_by_id);
router.delete("/:id",adminJWT, brandController.delete_brand_by_id);
router.get("/all", brandController.get_all_brand);
router.get("/:id", brandController.get_brand_by_id);

export const brandRouter = router;
