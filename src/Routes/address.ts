import { Router } from "express";
import { userJWT } from "../helper";
import { addressController } from "../controllers";

const router = Router();

router.post("/add", userJWT, addressController.add_address);
router.put("/edit", userJWT, addressController.edit_address);
router.delete("/:id", userJWT, addressController.delete_address);
router.get("/all", userJWT, addressController.get_all_address);

export const addressRouter = router;
