
import { prisma } from "../../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any, // using any to bypass strict version checks if needed
});

export const OrderService = {
  createOrder: async (userId: string | null | undefined, payload: any) => {
    const { items, successUrl, cancelUrl, shippingMethod, paymentMethod, customerInfo } = payload;
    let subTotal = 0;
    
    const shippingCost = shippingMethod === "inside_dhaka" ? 60 : shippingMethod === "outside_dhaka" ? 120 : 0;
    const discount = 0; // future: handle coupons

    // Validate items and calculate subTotal
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
      });
      if (!variant) throw new Error(`Variant ${item.productVariantId} not found`);
      if (variant.stock < item.quantity) {
        throw new Error(`Not enough stock for variant ${item.productVariantId}`);
      }
      subTotal += variant.price * item.quantity;
    }

    const totalAmount = subTotal;
    const payableAmount = totalAmount + shippingCost - discount;

    let dbPaymentMethod = "CASH_ON_DELIVERY";
    if (paymentMethod === "stripe") dbPaymentMethod = "STRIPE";
    if (paymentMethod === "partial") dbPaymentMethod = "PARTIAL_PAYMENT";
    if (paymentMethod === "manual") dbPaymentMethod = "MANUAL";

    // Create order in database
    const order = await prisma.order.create({
      data: {
        ...(userId ? { user: { connect: { id: userId } } } : {}),
        totalAmount,
        shippingCost,
        discount,
        payableAmount,
        paymentMode: dbPaymentMethod as any,
        customerEmail: customerInfo?.email || null,
        customerPhone: customerInfo?.phone || null,
        shippingAddress: customerInfo || null,
        items: {
          create: items.map((item: any) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Decrease stock for each variant
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    if (dbPaymentMethod === "CASH_ON_DELIVERY" || dbPaymentMethod === "MANUAL") {
      // Just record pending payment and return success without stripe URL
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: payableAmount,
          method: dbPaymentMethod as any,
          status: "PENDING",
        },
      });
      return { url: null, order };
    }

    // Otherwise, handle STRIPE or PARTIAL_PAYMENT via Stripe
    let stripePayableAmount = payableAmount;
    if (dbPaymentMethod === "PARTIAL_PAYMENT") {
      // Advance amount: flat 200 for now
      stripePayableAmount = 200; 
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${successUrl || "http://localhost:3000/success"}?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: cancelUrl || "http://localhost:3000/cancel",
      client_reference_id: order.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order.id.slice(0,8)} - ${dbPaymentMethod === "PARTIAL_PAYMENT" ? "Advance Payment" : "Full Payment"}`,
            },
            unit_amount: Math.round(stripePayableAmount * 100),
          },
          quantity: 1,
        }
      ],
    });

    // Save payment intent reference
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: stripePayableAmount,
        method: dbPaymentMethod as any,
        status: "PENDING",
        transactionId: session.id,
      },
    });

    return { url: session.url, order };
  },

  handleStripeWebhook: async (event: any) => {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.client_reference_id;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CONFIRMED" },
        });

        await prisma.payment.update({
          where: { orderId: orderId },
          data: { status: "PAID" },
        });
      }
    }
  },

  confirmPaymentLocally: async (orderId: string) => {
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });

      await prisma.payment.updateMany({
        where: { orderId: orderId },
        data: { status: "PAID" },
      });
    }
    return { success: true };
  },

  getOrders: async (filters: any) => {
    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          payment: true
        }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  getMyOrders: async (userId: string, filters: any) => {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userEmail = user?.email;

    const whereClause = {
      OR: [
        { userId },
        ...(userEmail ? [{ customerEmail: userEmail }] : [])
      ]
    };
    
    console.log("[DEBUG getMyOrders] userId:", userId);
    console.log("[DEBUG getMyOrders] userEmail:", userEmail);
    console.log("[DEBUG getMyOrders] whereClause:", JSON.stringify(whereClause, null, 2));

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              variant: {
                include: { product: { select: { name: true, media: true } } }
              }
            }
          },
          payment: true
        }
      }),
      prisma.order.count({ where: whereClause })
    ]);

    return {
      orders,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  getOrderById: async (id: string) => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: {
                product: { select: { name: true } }
              }
            }
          }
        },
        payment: true,
        allocations: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!order) throw new Error("Order not found");
    return order;
  },

  updateOrderStatus: async (id: string, status: any) => {
    // Record status history
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new Error("Order not found");

    const updated = await prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: status as any,
          note: "Status updated by admin"
        }
      });
      return tx.order.update({
        where: { id },
        data: { status: status as any }
      });
    });
    return updated;
  },

  cancelOrder: async (userId: string, orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        items: true
      }
    });

    if (!order) throw new Error("Order not found");
    if (order.userId !== userId && order.customerEmail !== userId) {
      // If caller is not admin, ensure they own the order
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (order.userId !== userId && order.customerEmail !== user?.email) {
        throw new Error("Unauthorized to cancel this order");
      }
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new Error(`Cannot cancel an order that is already ${order.status}`);
    }

    let refundDeduction = 0;
    if (order.status === 'SHIPPED') {
      refundDeduction = order.shippingCost;
    }
    const refundAmount = order.payableAmount - refundDeduction;

    const updated = await prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: { increment: item.quantity }
          }
        });
      }

      // Record status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'CANCELLED',
          note: `Order cancelled by customer. Refund amount: ৳${refundAmount}${refundDeduction > 0 ? ` (Deducted ৳${refundDeduction} for shipping)` : ''}`
        }
      });

      // Update payment if necessary
      if (order.payment && order.payment.status === 'PAID') {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { status: 'REFUNDED' }
        });
      }

      // Update order status
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      });
    });

    return updated;
  }
};
