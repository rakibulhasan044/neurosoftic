import express from "express";
import { InventoryController } from "./inventory.controller";

const router = express.Router();

router.get("/", InventoryController.getInventory);
router.patch("/:id/adjust", InventoryController.adjustStock);

export const InventoryRoutes = router;
