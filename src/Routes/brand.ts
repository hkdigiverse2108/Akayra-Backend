import { Router } from "express";
import { brandController } from "../controllers";

const router = Router();

router.post("/add", brandController.add_brand);
router.put("/edit", brandController.edit_brand_by_id);
router.delete("/:id", brandController.delete_brand_by_id);
router.get("/all", brandController.get_all_brand);
router.get("/:id", brandController.get_brand_by_id);

export const brandRouter = router;
