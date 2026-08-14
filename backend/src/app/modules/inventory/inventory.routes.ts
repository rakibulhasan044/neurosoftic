import express from "express";
import { InventoryController } from "./inventory.controller";

import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth("SUPER_ADMIN", "ADMIN"), InventoryController.getInventory);
router.patch("/:id/adjust", auth("SUPER_ADMIN", "ADMIN"), InventoryController.adjustStock);

export const InventoryRoutes = router;
