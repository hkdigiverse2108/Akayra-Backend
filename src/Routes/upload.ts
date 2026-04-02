import { Router } from "express";
import { uploadController } from "../controllers";
import { upload_image_middleware } from "../middleware/upload";

const router = Router();

router.post("/image", upload_image_middleware, uploadController.upload_image);
router.get("/image", uploadController.get_uploaded_image);
router.delete("/image", uploadController.delete_uploaded_image);

export const uploadRouter = router;
