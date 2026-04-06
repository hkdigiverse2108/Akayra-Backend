import { Router } from "express";
import { uploadController } from "../controllers";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/image", upload.any(), uploadController.upload_image);
router.get("/images", uploadController.get_all_images);
router.delete("/image", uploadController.delete_uploaded_image);

export const uploadRouter = router;

