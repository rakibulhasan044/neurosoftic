
import { prisma } from "@/app/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any, // using any to bypass strict version checks if needed
});

export const OrderService = {
  createOrder: async (userId: string, payload: any) => {
    // Basic implementation
    const { items, successUrl, cancelUrl } = payload;
    let totalAmount = 0;

    // Validate items and calculate total amount
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
      });
      if (!variant) throw new Error(`Variant ${item.productVariantId} not found`);
      totalAmount += variant.price * item.quantity;
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: successUrl || "http://localhost:3000/success",
      cancel_url: cancelUrl || "http://localhost:3000/cancel",
      client_reference_id: order.id,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd", // default currency
          product_data: {
            name: `Product Variant ID: ${item.productVariantId}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
    });

    // Save payment intent reference
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        method: "STRIPE",
        status: "PENDING",
        transactionId: session.id, // using session id to map back
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
  }
};
