import express from 'express';
import { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/addressController.js';
import auth from '../middleware/auth.js';

const addressRouter = express.Router();

// Get all addresses for the logged-in user
addressRouter.get('/', auth, getAddresses);

// Add a new address
addressRouter.post('/', auth, addAddress);

// Update an existing address by ID
addressRouter.put('/:id', auth, updateAddress);

// Delete an address by ID
addressRouter.delete('/:id', auth, deleteAddress);

export default addressRouter;