import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.post("/", auth(), ReviewController.createReview);
router.get("/product/:productId", ReviewController.getProductReviews);

export const ReviewRoutes = router;
