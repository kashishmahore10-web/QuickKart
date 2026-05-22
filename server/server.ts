import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js'; // Inngest client and functions [1]
import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import addressRouter from './routes/addressRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import deliveryPartnerRouter from './routes/deliveryPartnerRoutes.js';
import { stripeWebhooks } from './controllers/webhook.js';// Stripe webhook controller [2]

const app = express();
const PORT = process.env.PORT || 5000; // Configured for port 5000 [3]

// 1. Stripe Webhook Route (Must come BEFORE express.json middleware)
// Uses express.raw to verify the webhook signature [2, 4]
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// 2. Standard Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing [3]
app.use(express.json()); // Parses incoming JSON requests [3]

// 3. API Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Server is live'); // Default home route [5, 6]
});

app.use('/api/auth', authRouter); // User login and registration [7, 8]
app.use('/api/products', productRouter); // Product management [9]
app.use('/api/upload', uploadRouter); // Image uploads to Cloudinary [10]
app.use('/api/orders', orderRouter); // Order placement and tracking [11]
app.use('/api/addresses', addressRouter); // User address management [12]
app.use('/api/admin', adminRouter); // Admin dashboard statistics [13]
app.use('/api/delivery', deliveryPartnerRouter); // Delivery partner functionality [14]

// 4. Inngest Background Tasks Endpoint
// Mounts the serve function to handle background events and cron jobs [1, 15]
app.use('/api/inngest', serve({ client: inngest, functions }));

// 5. Global Error Handling Middleware
// Catches errors from any route and sends a 500 response [8, 16]
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

// 6. Start Server
app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`); // [3, 5]
});