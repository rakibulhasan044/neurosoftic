import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", OrderController.createOrder);
router.post("/webhook", express.raw({type: 'application/json'}), OrderController.stripeWebhook);

router.get("/", auth("SUPER_ADMIN", "ADMIN"), OrderController.getOrders);
router.get("/me/orders", auth(), OrderController.getMyOrders);
router.get("/:id", OrderController.getOrderById);
router.patch("/:id/status", OrderController.updateOrderStatus);

export const OrderRoutes = router;
