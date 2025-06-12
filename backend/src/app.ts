import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';
import { protect } from './middleware/auth';
import { upload } from './middleware/upload';

// Define a custom interface for file requests
interface FileRequest extends Request {
    file?: Express.Multer.File;
}

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// app.post('/api/test-upload', 
//     protect as RequestHandler,
//     upload.single('image'),
//     (req: Request & { file?: Express.Multer.File }, res: Response) => {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }
//         res.json({ 
//             message: 'File uploaded successfully',
//             fileUrl: req.file.path
//         });
//     }
// );

// Protected test route
app.get('/api/protected', 
    protect as RequestHandler, 
    (req: Request, res: Response) => {
        res.json({ message: 'You have access to this protected route', user: req.user });
    }
);

export default app;