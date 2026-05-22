import express from 'express';
import { 
  getFlashDeals, 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const productRouter = express.Router();

// Public routes
productRouter.get('/flash-deals', getFlashDeals);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProduct);

// Admin protected routes
productRouter.post('/', auth, admin, createProduct);
productRouter.put('/:id', auth, admin, updateProduct);
productRouter.delete('/:id', auth, admin, deleteProduct);

export default productRouter;