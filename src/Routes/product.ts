import { Router } from "express";
import { productController } from "../controllers";

const router = Router();

router.post("/add", productController.add_product);
router.put("/edit", productController.edit_product_by_id);
router.delete("/:id", productController.delete_product_by_id);
router.get("/all", productController.get_all_product);
router.get("/:id", productController.get_product_by_id);

export const productRouter = router;
