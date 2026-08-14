import { Request, Response, NextFunction } from "express";
import { StoreSettingsService } from "./store-settings.service";

export const StoreSettingsController = {
  getStoreSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await StoreSettingsService.getStoreSettings();
      res.status(200).json({
        success: true,
        message: "Store settings retrieved successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  updateStoreSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await StoreSettingsService.updateStoreSettings(req.body);
      res.status(200).json({
        success: true,
        message: "Store settings updated successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },
};
