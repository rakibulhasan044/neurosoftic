import express from "express";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/metrics", DashboardController.getMetrics);

export const DashboardRoutes = router;
