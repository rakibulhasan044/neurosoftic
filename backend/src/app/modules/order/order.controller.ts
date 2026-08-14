import { Request, Response } from "express";
import { OrderService } from "./order.service";

export const OrderController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId; // Set by optionalAuth middleware
      
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
  },

  confirmPayment: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      const result = await OrderService.confirmPaymentLocally(orderId);
      res.status(200).json({ success: true, message: "Payment confirmed", data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getOrders: async (req: Request, res: Response) => {
    try {
      const result = await OrderService.getOrders(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getMyOrders: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await OrderService.getMyOrders(userId, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getOrderById: async (req: Request, res: Response) => {
    try {
      const result = await OrderService.getOrderById(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const result = await OrderService.updateOrderStatus(req.params.id, status);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  cancelOrder: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await OrderService.cancelOrder(userId, req.params.id);
      res.status(200).json({ success: true, message: "Order cancelled successfully", data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
