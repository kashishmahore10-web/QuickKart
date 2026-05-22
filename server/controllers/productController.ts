import { Request, Response } from 'express'; [1]
import {prisma} from '../config/prisma.js'; [2]

export const getFlashDeals = async (req: Request, res: Response) => { [3]
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { originalPrice: 'desc' },
    }); [3]

    const productsWithDiscount = products.map((p: any) => {
      const discount = p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;
      return { ...p, discount };
    }); [4]

    res.json({ products: productsWithDiscount.slice(0, 8) }); [4]
  } catch (error: any) {
    res.status(500).json({ message: error.message }); [5]
  }
}; [4]

export const getProducts = async (req: Request, res: Response) => { [6]
  const { category, search, minPrice, maxPrice, sort } = req.query; [6]
  const where: any = {}; [6]

  if (category && category !== 'all') {
    where.category = category as string; [6]
  }

  if (search) {
    where.name = { contains: search as string, mode: 'insensitive' }; [7]
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  } [7]

  let orderBy: any = {};
  if (sort === 'price-low') orderBy = { price: 'asc' };
  else if (sort === 'price-high') orderBy = { price: 'desc' };
  else orderBy = { createdAt: 'desc' }; [7, 8]

  try {
    const products = await prisma.product.findMany({ where, orderBy }); [8]

    const productsWithDiscount = products.map((p: any) => ({
      ...p,
      discount: p.originalPrice > p.price 
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
        : 0,
    })); [8]

    res.json({ products: productsWithDiscount }); [8]
  } catch (error: any) {
    res.status(500).json({ message: error.message }); [6]
  }
}; [8]

export const getProduct = async (req: Request, res: Response) => { [9]
  const { id } = req.params; [9]
  try {
    const product = await prisma.product.findUnique({
      where: { id: id as string },
    }); [9]

    if (!product) {
      return res.status(404).json({ message: "Product not found" }); [9]
    }

    const discount = product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0; [10]

    res.json({ product: { ...product, discount } }); [10]
  } catch (error: any) {
    res.status(500).json({ message: error.message }); [9]
  }
}; [10]

export const createProduct = async (req: Request, res: Response) => { [11]
  try {
    const product = await prisma.product.create({
      data: req.body,
    }); [11]
    res.status(201).json(product); [11]
  } catch (error: any) {
    res.status(500).json({ message: error.message }); [10]
  }
}; [11]

export const updateProduct = async (req: Request, res: Response) => { [11]
  const { id } = req.params; [12]
  try {
    const product = await prisma.product.update({
      where: { id: id as string },
      data: req.body,
    }); [12]
    res.json(product); [12]
  } catch (error: any) {
    res.status(500).json({ message: error.message }); [11]
  }
}; [12]

export const deleteProduct = async (req: Request, res: Response) => { [12]
  const { id } = req.params; [12]
  try {
    await prisma.product.update({
      where: { id: id as string },
      data: { stock: 0 },
    }); [13, 14]
    res.json({ message: "Product updated" }); [14]
  } catch (error: any) {
    res.status(500).json({ message: error.message }); [12]
  }
}; 