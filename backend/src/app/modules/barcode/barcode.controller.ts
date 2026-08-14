import { Request, Response, NextFunction } from "express";
import { BarcodeService } from "./barcode.service";

export const BarcodeController = {
  generate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId, variantCode } = req.body;
      if (!categoryId || !variantCode) {
        return res.status(400).json({ success: false, message: "categoryId and variantCode are required" });
      }

      const result = await BarcodeService.generateBarcode(categoryId, variantCode);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
};
