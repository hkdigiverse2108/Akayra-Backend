import { Router } from "express";
import { adminJWT, userJWT } from "../helper";
import { addressController } from "../controllers";

const router = Router();

router.post("/add",adminJWT , addressController.add_address);
router.put("/edit",adminJWT, addressController.edit_address);
router.delete("/:id",adminJWT, addressController.delete_address);
router.get("/all",adminJWT, addressController.get_all_address);

export const addressRouter = router;
