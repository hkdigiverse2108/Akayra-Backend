import { Router } from "express";
import { productController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT , productController.add_product);
router.put("/edit", adminJWT ,productController.edit_product_by_id);
router.delete("/:id", adminJWT ,productController.delete_product_by_id);
router.get("/all", productController.get_all_product);
router.get("/:id", productController.get_product_by_id);

export const productRouter = router;
