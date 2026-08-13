import express from "express";
import { StoreSettingsController } from "./store-settings.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", StoreSettingsController.getStoreSettings);
router.patch("/", auth("SUPER_ADMIN", "ADMIN"), StoreSettingsController.updateStoreSettings);

export const StoreSettingsRoutes = router;
