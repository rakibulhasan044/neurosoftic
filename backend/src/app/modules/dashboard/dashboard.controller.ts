import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  getMetrics: async (req: Request, res: Response) => {
    try {
      const result = await DashboardService.getMetrics();
      res.status(200).json({
        success: true,
        message: "Metrics retrieved successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
