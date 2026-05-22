import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided authorization denied' 
      });
    }

    const token = authHeader.split(' ')[3];

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET as string
    ) as { id: string };

    req.user = { id: decoded.id };
    
    next();
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ 
      message: 'Token is not verified' 
    });
  }
};
export default auth;