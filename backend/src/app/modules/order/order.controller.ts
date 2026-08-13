import { Request, Response } from "express";
import { OrderService } from "./order.service";

export const OrderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId; // Assuming auth middleware sets this
      const result = await OrderService.createOrder(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  stripeWebhook: async (req: Request, res: Response) => {
    try {
      const event = req.body;
      await OrderService.handleStripeWebhook(event);
      res.status(200).send("Webhook received");
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
};
