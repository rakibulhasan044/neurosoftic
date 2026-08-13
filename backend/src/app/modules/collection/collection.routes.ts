import express from "express";
import { CollectionController } from "./collection.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), CollectionController.create);
router.get("/", CollectionController.getAll);
router.get("/:slug", CollectionController.getBySlug);
router.patch("/:id", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), CollectionController.update);
router.delete("/:id", auth("SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"), CollectionController.delete);

export const CollectionRoutes = router;
