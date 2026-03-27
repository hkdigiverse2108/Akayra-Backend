import { Router } from "express";
import { bannerController } from "../controllers";

const router = Router();

router.post("/add", bannerController.add_banner);
router.put("/edit", bannerController.edit_banner_by_id);
router.delete("/:id", bannerController.delete_banner_by_id);
router.get("/all", bannerController.get_all_banner);
router.get("/:id", bannerController.get_banner_by_id);

export const bannerRouter = router;
