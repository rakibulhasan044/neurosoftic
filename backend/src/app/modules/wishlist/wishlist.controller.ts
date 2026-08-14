import { Request, Response, NextFunction } from "express";
import { WishlistService } from "./wishlist.service";

export const WishlistController = {
  getWishlist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await WishlistService.getWishlist(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      next(err);
    }
  },

  toggleWishlist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const { productId } = req.body;
      const result = await WishlistService.toggleWishlist(userId, productId);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      next(err);
    }
  }
};
