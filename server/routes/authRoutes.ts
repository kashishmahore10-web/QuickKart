import express from 'express';
import { register, login } from '../controllers/authController.js';

const authRouter = express.Router();

// Route for user registration
authRouter.post('/register', register);

// Route for user login
authRouter.post('/login', login);

export default authRouter;