import express from 'express';
import { 
    createPetPost, 
    getPetPosts, 
    getPetPostById,
    updatePetPost,
    deletePetPost,
    likePetPost,
    unlikePetPost,
    searchPosts,
    filterPosts 
} from '../controllers/petController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Create and Read routes
router.post('/', protect as express.RequestHandler, upload.array('images', 5), createPetPost as express.RequestHandler);
router.get('/', getPetPosts as express.RequestHandler);
router.get('/search', searchPosts as express.RequestHandler); // Make sure this is before /:id route
router.get('/filter', filterPosts as express.RequestHandler); // Make sure this is before /:id route
router.get('/:id', getPetPostById as express.RequestHandler);

// Update and Delete routes
router.put('/:id', protect as express.RequestHandler, updatePetPost as express.RequestHandler);
router.delete('/:id', protect as express.RequestHandler, deletePetPost as express.RequestHandler);

// Like/Unlike routes
router.put('/:id/like', protect as express.RequestHandler, likePetPost as express.RequestHandler);
router.put('/:id/unlike', protect as express.RequestHandler, unlikePetPost as express.RequestHandler);

export default router;