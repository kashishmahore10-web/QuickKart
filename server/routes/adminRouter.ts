import express from 'express';
import { 
  getAdminStats, 
  getDeliveryPartners, 
  createDeliveryPartner, 
  updateDeliveryPartner, 
  assignDeliveryPartner 
} from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const adminRouter = express.Router();

// Get admin dashboard stats
adminRouter.get('/stats', auth, admin, getAdminStats);

// Delivery partner management routes
adminRouter.get('/delivery-partners', auth, admin, getDeliveryPartners);
adminRouter.post('/delivery-partners', auth, admin, createDeliveryPartner);
adminRouter.put('/delivery-partners/:id', auth, admin, updateDeliveryPartner);

// Assign delivery partner to a specific order
adminRouter.put('/orders/:id/assign', auth, admin, assignDeliveryPartner);

export default adminRouter;