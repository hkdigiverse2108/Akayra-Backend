import { Router } from "express";
import { settingsController } from "../controllers";
const router = Router();
router.get("/", settingsController.get_settings);
router.put("/update", settingsController.update_settings);
export const settingsRouter = router;
