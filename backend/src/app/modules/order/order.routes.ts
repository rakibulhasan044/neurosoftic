import express from "express";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", OrderController.createOrder);
router.post("/webhook", express.raw({type: 'application/json'}), OrderController.stripeWebhook);

router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrderById);
router.patch("/:id/status", OrderController.updateOrderStatus);

export const OrderRoutes = router;
