import express from "express";
import { ProductController } from "./product.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:slug", ProductController.getProductBySlug);
router.patch("/:id", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), ProductController.updateProduct);
router.delete("/:id", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), ProductController.deleteProduct);

export const ProductRoutes = router;
