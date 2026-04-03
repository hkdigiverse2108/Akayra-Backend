import { Router } from "express";
import { settingsController } from "../controllers";
import { adminJWT } from "../helper";

const router = Router();

router.put("/update", adminJWT, settingsController.update_settings);
router.get("/", settingsController.get_settings);

export const settingsRouter = router;
