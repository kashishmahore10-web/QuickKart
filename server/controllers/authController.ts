import { Request, Response } from 'express';
import {prisma} from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token [1, 2]
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// Helper function to check if the user is an admin based on environment variables [3, 4]
const getAdminStatus = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS 
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()) 
    : [];
  return adminEmails.includes(email.toLowerCase());
};

// Register Controller [1-9]
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    
    // Prepare user data for response, excluding password [2, 3]
    const userData: any = { ...user };
    delete userData.password;
    userData.isAdmin = getAdminStatus(userData.email);

    res.status(201).json({ user: userData, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login Controller [9-11]
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { addresses: true }, // Include addresses for login data [10]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    // Prepare user data for response [11]
    const userData: any = { ...user };
    delete userData.password;
    userData.isAdmin = getAdminStatus(userData.email);

    res.json({ user: userData, token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
