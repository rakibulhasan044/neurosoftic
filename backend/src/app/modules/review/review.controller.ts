import { Request, Response } from "express";
import { ReviewService } from "./review.service";

export const ReviewController = {
  createReview: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await ReviewService.createReview(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getProductReviews: async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const result = await ReviewService.getProductReviews(productId, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
