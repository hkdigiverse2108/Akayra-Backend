import { Router } from "express";
import { wishlistController } from "../controllers";
const router = Router();
router.post("/add", wishlistController.add_to_wishlist);
router.delete("/:id", wishlistController.remove_from_wishlist);
router.get("/", wishlistController.get_my_wishlist);
export const wishlistRouter = router;
