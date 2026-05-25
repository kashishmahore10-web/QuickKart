import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const stripeWebhooks = async (
  req: Request,
  res: Response
) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret as string
    );
  } catch (err: any) {
    console.error(
      "Webhook signature verification failed:",
      err.message
    );

    return res.status(400).send(
      `Webhook Error: ${err.message}`
    );
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent =
        event.data.object as Stripe.PaymentIntent;

      const sessions =
        await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

      const session = sessions.data[0];

      const orderId = session?.metadata?.orderId;

      if (orderId) {
        const paidOrder =
          await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              isPaid: true,
            },
          });

        const orderItems = Array.isArray(
          paidOrder.items
        )
          ? (paidOrder.items as any[])
          : [];

        for (const item of orderItems) {
          await prisma.product.update({
            where: {
              id: item.product,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        await inngest.send({
          name: "order/placed",
          data: {
            orderId: paidOrder.id,
          },
        });

        for (const item of orderItems) {
          await inngest.send({
            name: "inventory/stock.updated",
            data: {
              productId: item.product,
            },
          });
        }
      }

      break;
    }

    case "payment_intent.payment_failed":
    case "payment_intent.canceled": {
      const paymentIntentFailure =
        event.data.object as Stripe.PaymentIntent;

      const sessionsFailure =
        await stripe.checkout.sessions.list({
          payment_intent:
            paymentIntentFailure.id,
        });

      const sessionFailure =
        sessionsFailure.data[0];

      const failureOrderId =
        sessionFailure?.metadata?.orderId;

      if (failureOrderId) {
        await prisma.order.delete({
          where: {
            id: failureOrderId,
          },
        });
      }

      break;
    }

    default:
      console.log(
        `Unhandled event type ${event.type}`
      );
  }

  return res.json({
    received: true,
  });
};