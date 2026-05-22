import { NextFunction, Request, Response } from 'express';
import {prisma} from '../config/prisma.js';

const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; [1]

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' }); [1]
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    }); [1]

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); [1]
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
      : []; [2]

    if (adminEmails.includes(user.email.toLowerCase())) { [2]
      if (req.user) {
        req.user.isAdmin = true; [2]
      }
      next(); [2]
    } else {
      res.status(403).json({ message: 'Admin access required' }); [3]
    }
  } catch (error: any) {
    console.error(error); [4]
    res.status(500).json({
      message: 'Admin verification failed',
      error: error.message,
    }); [4]
  }
};

export default admin; [4]