import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";

export const ProductController = {
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.getAllProducts(req.query);
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  getProductBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.getProductBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err: any) {
      next(err);
    }
  }
};
