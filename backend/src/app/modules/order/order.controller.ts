import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";

export const OrderController = {
  createOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId; // Set by optionalAuth middleware
      
      const result = await OrderService.createOrder(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  stripeWebhook: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = req.body;
      await OrderService.handleStripeWebhook(event);
      res.status(200).send("Webhook received");
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },

  confirmPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const result = await OrderService.confirmPaymentLocally(orderId);
      res.status(200).json({ success: true, message: "Payment confirmed", data: result });
    } catch (err: any) {
      next(err);
    }
  },

  getOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await OrderService.getOrders(req.query);
      res.status(200).json({ 
        success: true, 
        message: "Orders fetched successfully",
        meta: result.meta,
        data: result.orders 
      });
    } catch (err: any) {
      next(err);
    }
  },

  getMyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await OrderService.getMyOrders(userId, req.query);
      res.status(200).json({ 
        success: true, 
        message: "Orders fetched successfully",
        meta: result.meta,
        data: result.orders 
      });
    } catch (err: any) {
      next(err);
    }
  },

  getOrderById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await OrderService.getOrderById(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      next(err);
    }
  },

  updateOrderStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const result = await OrderService.updateOrderStatus(req.params.id, status);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      next(err);
    }
  },

  cancelOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const result = await OrderService.cancelOrder(userId, req.params.id);
      res.status(200).json({ success: true, message: "Order cancelled successfully", data: result });
    } catch (err: any) {
      next(err);
    }
  }
};
