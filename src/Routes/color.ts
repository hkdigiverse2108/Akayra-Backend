import { Router } from "express";
import { colorController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT, colorController.add_color);
router.put("/edit",adminJWT, colorController.edit_color_by_id);
router.delete("/:id",adminJWT, colorController.delete_color_by_id);
router.get("/all",userJWT, colorController.get_all_color);
router.get("/:id",userJWT, colorController.get_color_by_id);

export const colorRouter = router;
