import { Request, Response } from 'express';
import {prisma} from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id, role: 'delivery' }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const loginPartner = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const partner = await prisma.deliveryPartner.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!partner) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!partner.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    const isMatch = await bcrypt.compare(password, partner.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(partner.id);

    const { password: _, ...partnerData } = partner;

    res.json({ partner: partnerData, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDeliveries = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {
    deliveryPartnerId: req.partner!.id,
  };

  if (status === 'active') {
    where.status = { in: ['assigned', 'packed', 'out for delivery'] };
  } else if (status === 'completed') {
    where.status = { in: ['delivered', 'cancelled'] };
  }

  try {
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeliveryDetails = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        deliveryPartnerId: req.partner!.id,
      },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const completeDelivery = async (req: Request, res: Response) => {
  const { OTP } = req.body;

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        deliveryPartnerId: req.partner!.id,
      },
    });

    if (!order || order.status === 'cancelled' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (order.deliveryOTP !== OTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as any)] : [];
    history.push({
      status: 'delivered',
      note: 'Delivered by partner',
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'delivered',
        statusHistory: history,
        deliveryOTP: '',
      },
    });

    res.json({ order: updatedOrder, message: 'Delivery completed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelDelivery = async (req: Request, res: Response) => {
  const { reason } = req.body;

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        deliveryPartnerId: req.partner!.id,
      },
    });

    if (!order || order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel a delivered order' });
    }

    const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as any)] : [];
    history.push({
      status: 'cancelled',
      note: reason || '',
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'cancelled',
        statusHistory: history,
      },
    });

    res.json({ order: updatedOrder, message: 'Delivery cancelled' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const allowedStatus = ['packed', 'out for delivery'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        deliveryPartnerId: req.partner!.id,
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as any)] : [];
    history.push({
      status,
      note: `Status updated to ${status}`,
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
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

export const updateLocation = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        deliveryPartnerId: req.partner!.id,
        status: { in: ['assigned', 'packed', 'out for delivery'] },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Active order not found' });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        liveLocation: {
          latitude,
          longitude,
          updatedAt: new Date(),
        },
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};