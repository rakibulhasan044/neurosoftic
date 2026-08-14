import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import optionalAuth from "../../middlewares/optionalAuth";

const router = express.Router();

router.post("/", optionalAuth(), OrderController.createOrder);
router.post(
  "/confirm-payment",
  OrderController.confirmPayment
);

router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  OrderController.stripeWebhook
);

router.get("/", auth("SUPER_ADMIN", "ADMIN"), OrderController.getOrders);
router.get("/me/orders", auth(), OrderController.getMyOrders);
router.get("/:id", auth(), OrderController.getOrderById);
router.put("/:id/status", auth("SUPER_ADMIN", "ADMIN"), OrderController.updateOrderStatus);
router.post("/:id/cancel", auth(), OrderController.cancelOrder);

export const OrderRoutes = router;
