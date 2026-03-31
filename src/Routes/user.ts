import { Router } from "express";
import { userController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();
 
router.use(userJWT)
router.post("/add", userController.add_user);
router.put("/edit", userController.edit_user_by_id);
router.delete("/:id", userController.delete_user_by_id);
router.get("/all", userController.get_all_user);
router.get("/:id", userController.get_user_by_id);

export const userRouter = router;
