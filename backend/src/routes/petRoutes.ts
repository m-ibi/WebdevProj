import express from 'express';
import { createPetPost, getPetPosts, getPetPostById } from '../controllers/petController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect as express.RequestHandler, createPetPost as express.RequestHandler);
router.get('/', getPetPosts as express.RequestHandler);
router.get('/:id', getPetPostById as express.RequestHandler);

export default router;