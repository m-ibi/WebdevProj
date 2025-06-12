import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile, 
    getUserPosts,
    getUserById,
    deleteProfilePicture
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/profile', protect as express.RequestHandler, getUserProfile as express.RequestHandler);
router.put('/profile', 
    protect as express.RequestHandler, 
    upload.single('profilePicture'),
    updateUserProfile as express.RequestHandler
);
router.get('/posts', protect as express.RequestHandler, getUserPosts as express.RequestHandler);
router.get('/:id', getUserById as express.RequestHandler);
router.delete('/profile-picture', protect as express.RequestHandler, deleteProfilePicture as express.RequestHandler);

export default router;