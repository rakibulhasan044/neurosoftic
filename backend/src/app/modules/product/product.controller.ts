import { Request, Response } from "express";
import { ProductService } from "./product.service";

export const ProductController = {
  createProduct: async (req: Request, res: Response) => {
    try {
      const result = await ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAllProducts: async (req: Request, res: Response) => {
    try {
      const result = await ProductService.getAllProducts();
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getProductBySlug: async (req: Request, res: Response) => {
    try {
      const result = await ProductService.getProductBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
