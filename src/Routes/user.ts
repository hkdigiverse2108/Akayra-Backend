import { Router } from "express";
import { userController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/add", userJWT, userController.add_user);
router.put("/edit", userJWT, userController.edit_user_by_id);
router.delete("/:id", userJWT, userController.delete_user_by_id);
router.get("/all", userJWT, userController.get_all_user);
router.get("/:id", userJWT, userController.get_user_by_id);

export const userRouter = router;
