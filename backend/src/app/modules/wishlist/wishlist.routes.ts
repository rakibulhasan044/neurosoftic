import express from "express";
import { WishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth(), WishlistController.getWishlist);
router.post("/toggle", auth(), WishlistController.toggleWishlist);

export const WishlistRoutes = router;
