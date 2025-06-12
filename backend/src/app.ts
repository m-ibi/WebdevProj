import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import { protect } from './middleware/auth';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);


// Protected test route
app.get('/api/protected', protect as express.RequestHandler, (req: Request, res: Response) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});

export default app;