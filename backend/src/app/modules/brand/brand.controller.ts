import { Request, Response } from "express";
import { BrandService } from "./brand.service";

export const BrandController = {
  create: async (req: Request, res: Response) => {
    try {
      const data = await BrandService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await BrandService.getAll();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  getBySlug: async (req: Request, res: Response) => {
    try {
      const data = await BrandService.getBySlug(req.params.slug);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const data = await BrandService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      await BrandService.delete(req.params.id);
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};
