import express from "express";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/metrics", DashboardController.getMetrics);
router.get("/charts", DashboardController.getCharts);

export const DashboardRoutes = router;
