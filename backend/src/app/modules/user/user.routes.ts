import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Profile routes
router.get("/profile", auth(), UserController.getProfile);
router.patch("/profile", auth(), UserController.updateProfile);

// Address routes
router.get("/addresses", auth(), UserController.getAddresses);
router.post("/addresses", auth(), UserController.addAddress);
router.patch("/addresses/:id", auth(), UserController.updateAddress);
router.delete("/addresses/:id", auth(), UserController.deleteAddress);

// Admin routes
router.post("/", auth("SUPER_ADMIN", "ADMIN"), UserController.createUser);
router.delete("/:id", auth("SUPER_ADMIN", "ADMIN"), UserController.deleteUser);
router.patch("/:id/role", auth("SUPER_ADMIN", "ADMIN"), UserController.updateUserRole);

export const UserRoutes = router;
