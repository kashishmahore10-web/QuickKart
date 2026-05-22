import { Request, Response } from 'express';
import {prisma}  from '../config/prisma.js';
import { inngest } from '../inngest';
import Stripe from 'stripe';

export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const productIds = items.map((item: any) => item.product);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap: Record<string, any> = {};
    products.forEach((p: any) => {
      productMap[p.id] = p;
    });

    for (const item of items) {
      const product = productMap[item.product];
      if (!product || (product.stock || 0) < item.quantity) {
        return res.status(404).json({ message: `Product ${item.product} out of stock` });
      }
    }

    const orderItems = items.map((item: any) => {
      const dbProduct = productMap[item.product];
      return {
        product: dbProduct.id,
        name: dbProduct.name,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity: item.quantity,
        unit: dbProduct.unit,
      };
    });

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        total,
        statusHistory: [
          {
            status: 'placed',
            note: 'Order placed successfully',
            timestamp: new Date(),
          },
        ],
      },
    });

    if (paymentMethod === 'card') {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      const session = await stripe.checkout.sessions.create({
        success_url: `${req.headers.origin}/orders?clearCart=true`,
        cancel_url: `${req.headers.origin}/checkout`,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Groceries' },
              unit_amount: Math.round(total * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: { orderId: order.id },
      });

      return res.json({ url: session.url });
    }

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.product },
        data: { stock: { decrement: item.quantity } },
      });
    }

    for (const item of orderItems) {
      await inngest.send({
        name: 'inventory/stock.updated',
        data: { productId: item.product },
      });
    }

    await inngest.send({
      name: 'order/placed',
      data: { orderId: order.id },
    });

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {
    userId: req.user!.id,
    NOT: { paymentMethod: 'card', isPaid: false },
  };

  if (status && status !== 'all') {
    where.status = status;
  }

  try {
    const orders = await prisma.order.findMany({
      where,
      include: {
        deliveryPartner: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.user!.id,
      },
      include: {
        deliveryPartner: {
          select: {
            name: true,
            phone: true,
            avatar: true,
            vehicleType: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = req.body;
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as any)] : [];
    history.push({
      status,
      note: note || `Order ${status}`,
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status,
        statusHistory: history,
      },
    });

    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        NOT: { paymentMethod: 'card', isPaid: false },
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        deliveryPartner: {
          select: { name: true, phone: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderLocation = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.user!.id,
      },
      select: {
        liveLocation: true,
        status: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      liveLocation: order.liveLocation,
      status: order.status,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};