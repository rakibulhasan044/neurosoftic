import { Request, Response } from "express";
import { InventoryService } from "./inventory.service";

export const InventoryController = {
  getInventory: async (req: Request, res: Response) => {
    try {
      const result = await InventoryService.getInventory(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  adjustStock: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const result = await InventoryService.adjustStock(id, Number(stock));
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
