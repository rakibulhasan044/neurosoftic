import express from "express";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", OrderController.createOrder);
router.post("/webhook", express.raw({type: 'application/json'}), OrderController.stripeWebhook);

export const OrderRoutes = router;
