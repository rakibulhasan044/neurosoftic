import express from "express";
import { BrandController } from "./brand.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), BrandController.create);
router.get("/", BrandController.getAll);
router.get("/:slug", BrandController.getBySlug);
router.patch("/:id", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), BrandController.update);
router.delete("/:id", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), BrandController.delete);

export const BrandRoutes = router;
