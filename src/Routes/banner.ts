import { Router } from "express";
import { bannerController } from "../controllers";
import { adminJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT , bannerController.add_banner);
router.put("/edit",adminJWT, bannerController.edit_banner_by_id);
router.delete("/:id",adminJWT, bannerController.delete_banner_by_id);
router.get("/all", bannerController.get_all_banner);
router.get("/:id", bannerController.get_banner_by_id);

export const bannerRouter = router;
