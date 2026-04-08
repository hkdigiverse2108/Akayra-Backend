import { Router } from "express";
import { wishlistController } from "../controllers";
import { userJWT } from "../helper";

const router = Router();

router.post("/add",userJWT , wishlistController.add_to_wishlist);
router.delete("/:id",userJWT, wishlistController.remove_from_wishlist);
router.get("/",userJWT, wishlistController.get_my_wishlist);

export const wishlistRouter = router;
