import { Inngest } from "inngest";
import {prisma} from "../config/prisma.js";
import sendEmail from "../config/nodemailer.js";

export const inngest = new Inngest({ id: "grocery-delivery" });

export const checkLowStock = inngest.createFunction(
  { id: "check-low-stock", name: "Low Stock Alert" ,
 triggers : [{ event: "inventory/stock.updated" }]},
  async ({ event, step }) => {
    const { productId } = event.data;
    const product = await step.run("fetch-product", async () => {
      return await prisma.product.findUnique({ where: { id: productId } });
    });

    if (!product || product.stock === null || product.stock >= 10) {
      return { skipped: true, stock: product?.stock };
    }

    await step.run("send-low-stock-email", async () => {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
      if (adminEmails.length === 0) return { skipped: true, reason: "no admin emails" };

      await sendEmail({
        to: adminEmails.join(","),
        subject: `Low Stock Alert: ${product.name}`,
        body: `<h1>Low Stock Alert</h1><p>${product.name} is running low on stock. Current stock: ${product.stock}</p>`
      });
    });

    return { alerted: true, product: product.name, stock: product.stock };
  }
);

export const sendMonthlyOffers = inngest.createFunction(
  { id: "send-monthly-offers", name: "Monthly Payday Offers" ,
  triggers:[ { cron: "0 10 1 * *" } ]}  ,
  async ({ step }) => {
    const { deals, users } = await step.run("fetch-deals-and-users", async () => {
      const products = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { originalPrice: "desc" },
        take: 6
      });
      const allUsers = await prisma.user.findMany({
        select: { name: true, email: true }
      });
      return { deals: products, users: allUsers };
    });

    if (users.length === 0 || deals.length === 0) return { skipped: true };

    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await step.run(`send-offers-batch-${i}`, async () => {
        for (const u of batch) {
          await sendEmail({
            to: u.email,
            subject: "Fresh picks just for you",
            body: `<h1>Monthly Offers</h1><p>Check out our latest deals!</p>`
          });
        }
      });
    }
  }
);

export const autoAssignRider = inngest.createFunction(
  { id: "auto-assign-rider", name: "Auto Assign Delivery Rider" ,
  triggers:[ { event: "order/placed" } ]}  ,
  async ({ event, step }) => {
    const { orderId } = event.data;
    await step.sleep("wait-5-minutes", "5m");

    const result = await step.run("assign-rider", async () => {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.deliveryPartnerId || ["cancelled", "delivered"].includes(order.status)) {
        return { skipped: true };
      }

      const busyOrders = await prisma.order.findMany({
        where: { status: { in: ["assigned", "packed", "out for delivery"] }, deliveryPartnerId: { not: null } },
        select: { deliveryPartnerId: true }
      });
      const busyRiderIds = busyOrders.map(o => o.deliveryPartnerId as string);

      const availableRider = await prisma.deliveryPartner.findFirst({
        where: { isActive: true, id: { notIn: busyRiderIds } }
      });

      if (!availableRider) return { skipped: true, reason: "no writers available" };

      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as any)] : [];
      history.push({ status: "assigned", note: `Auto assigned to ${availableRider.name}`, timestamp: new Date() });

      await prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryPartnerId: availableRider.id,
          deliveryOTP: OTP,
          status: "assigned",
          statusHistory: history
        }
      });

      return { assigned: true, riderId: availableRider.id, riderName: availableRider.name, orderId };
    });

    return result;
  }
);

export const functions = [checkLowStock, sendMonthlyOffers, autoAssignRider];