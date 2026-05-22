import { Request, Response } from 'express';
import {prisma} from '../config/prisma.js';
import bcrypt from 'bcrypt';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      outOfStock,
      totalPartners,
      recentOrders
    ] = await Promise.all([
      prisma.order.count({
        where: {
          NOT: [
            { paymentMethod: 'card', isPaid: false }
          ]
        }
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({
        where: { stock: 0 }
      }),
      prisma.deliveryPartner.count(),
      prisma.order.findMany({
        where: {
          NOT: [
            { paymentMethod: 'card', isPaid: false }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          user: {
            select: { name: true, email: true }
          },
          deliveryPartner: {
            select: { name: true, phone: true }
          }
        }
      })
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      outOfStock,
      totalPartners,
      recentOrders
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeliveryPartners = async (req: Request, res: Response) => {
  try {
    const partners = await prisma.deliveryPartner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ partners });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDeliveryPartner = async (req: Request, res: Response) => {
  const { email, name, password, phone, vehicleType } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const partner = await prisma.deliveryPartner.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashPassword,
        phone,
        vehicleType
      }
    });

    res.status(201).json(partner);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeliveryPartner = async (req: Request, res: Response) => {
  const { name, phone, vehicleType, isActive } = req.body;
  const data: any = {};

  if (name) data.name = name;
  if (phone) data.phone = phone;
  if (vehicleType) data.vehicleType = vehicleType;
  if (isActive !== undefined) data.isActive = isActive;

  try {
    const partner = await prisma.deliveryPartner.update({
      where: { id: req.params.id as string },
      data
    });
    res.json(partner);
  } catch (error: any) {
    res.status(404).json({ message: 'Partner not found' });
  }
};

export const assignDeliveryPartner = async (req: Request, res: Response) => {
  const { partnerId } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: { id: partnerId }
    });

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const history = Array.isArray(order.statusHistory) ? [...(order.statusHistory as any)] : [];

    if (order.status === 'placed' || order.status === 'confirmed') {
      history.push({
        status: 'assigned',
        note: `Assigned to ${partner?.name}`,
        timestamp: new Date()
      });

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          deliveryPartnerId: partnerId,
          deliveryOTP: OTP,
          status: 'assigned',
          statusHistory: history
        }
      });

      res.json(updatedOrder);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};