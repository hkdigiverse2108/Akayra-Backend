import { Router } from "express";
import { sizeController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT , sizeController.add_size);
router.put("/edit",adminJWT , sizeController.edit_size_by_id);
router.delete("/:id",adminJWT, sizeController.delete_size_by_id);
router.get("/all",userJWT, sizeController.get_all_size);
router.get("/:id",userJWT, sizeController.get_size_by_id);

export const sizeRouter = router;
