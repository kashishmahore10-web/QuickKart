import { Request, Response } from 'express';
import {prisma} from '../config/prisma.js';

// Get all addresses for the logged-in user
// GET /api/addresses
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new address
// POST /api/addresses
export const addAddress = async (req: Request, res: Response) => {
  const { 
    label, address, city, state, zip, isDefault, latitude, longitude 
  } = req.body;

  // Coordinates are required for live tracking features
  if (latitude === null || longitude === null) {
    return res.status(400).json({ 
      message: 'Location coordinates are required please allow location access' 
    });
  }

  try {
    const currentAddresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
    });

    // If it's the user's first address, make it the default automatically
    let makeDefault = isDefault;
    if (currentAddresses.length === 0) {
      makeDefault = true;
    }

    // If setting a new default, remove default status from all existing addresses
    if (makeDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: req.user!.id,
        label,
        address,
        city,
        state,
        zip,
        isDefault: makeDefault,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    // Return the updated list of addresses to sync the frontend immediately
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    });

    res.status(201).json(addresses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing address
// PUT /api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
  const { 
    label, address, city, state, zip, isDefault, latitude, longitude 
  } = req.body;

  try {
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const data: any = {};
    if (label) data.label = label;
    if (address) data.address = address;
    if (city) data.city = city;
    if (state) data.state = state;
    if (zip) data.zip = zip;
    if (isDefault !== undefined) data.isDefault = isDefault;
    if (latitude !== null) data.latitude = Number(latitude);
    if (longitude !== null) data.longitude = Number(longitude);

    await prisma.address.update({
      where: { id: req.params.id as string },
      data,
    });

    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(addresses);
  } catch (error: any) {
    res.status(404).json({ message: 'Address not found' });
  }
};

// Delete an address
// DELETE /api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prisma.address.delete({
      where: { id: req.params.id as string },
    });

    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(addresses);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};