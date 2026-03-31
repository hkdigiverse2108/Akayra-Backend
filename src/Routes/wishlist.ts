import { Router } from "express";
import { wishlistController } from "../controllers";
import { adminJWT } from "../helper";

const router = Router();

router.post("/add",adminJWT , wishlistController.add_to_wishlist);
router.delete("/:id",adminJWT, wishlistController.remove_from_wishlist);
router.get("/",adminJWT, wishlistController.get_my_wishlist);

export const wishlistRouter = router;
