import express from 'express';
import { 
  loginPartner, 
  getMyDeliveries, 
  getDeliveryDetails, 
  completeDelivery, 
  cancelDelivery, 
  updateDeliveryStatus, 
  updateLocation 
} from '../controllers/deliveryPartnerController.js'; // Delivery partner controller functions
import deliveryAuth from '../middleware/deliveryAuth.js'; // Referred to as delivery o in the sources

const deliveryPartnerRouter = express.Router();

// Route for delivery partner login
deliveryPartnerRouter.post('/login', loginPartner);

// Routes for managing assigned deliveries (Auth Required)
deliveryPartnerRouter.get('/my-deliveries', deliveryAuth, getMyDeliveries);
deliveryPartnerRouter.get('/my-deliveries/:id', deliveryAuth, getDeliveryDetails);
deliveryPartnerRouter.put('/my-deliveries/:id/complete', deliveryAuth, completeDelivery);
deliveryPartnerRouter.put('/my-deliveries/:id/cancel', deliveryAuth, cancelDelivery);
deliveryPartnerRouter.put('/my-deliveries/:id/status', deliveryAuth, updateDeliveryStatus);
deliveryPartnerRouter.put('/my-deliveries/:id/location', deliveryAuth, updateLocation);

export default deliveryPartnerRouter;
