import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  getMetrics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await DashboardService.getMetrics();
      res.status(200).json({
        success: true,
        message: "Metrics retrieved successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  getCharts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const period = (req.query.period as string) || "monthly";
      const year = (req.query.year as string) || new Date().getFullYear().toString();
      const result = await DashboardService.getCharts(period, year);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  }
};
