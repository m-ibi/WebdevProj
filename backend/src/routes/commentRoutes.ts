import express from 'express';
import { createComment, getPostComments } from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/:postId', protect as express.RequestHandler, createComment as express.RequestHandler);
router.get('/:postId', getPostComments as express.RequestHandler);

export default router;