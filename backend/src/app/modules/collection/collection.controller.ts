import { Request, Response, NextFunction } from "express";
import { CollectionService } from "./collection.service";

export const CollectionController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CollectionService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CollectionService.getAll();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  },
  getBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CollectionService.getBySlug(req.params.slug);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CollectionService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CollectionService.delete(req.params.id);
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  }
};
