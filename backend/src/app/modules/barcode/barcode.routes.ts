import express from "express";
import { BarcodeController } from "./barcode.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/generate", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), BarcodeController.generate);

export const BarcodeRoutes = router;
