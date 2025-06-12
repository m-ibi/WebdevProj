import { Request, Response } from 'express';
import Comment from '../models/Comment';
import PetPost from '../models/PetPost';

export const createComment = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;

        const comment = await Comment.create({
            content,
            user: req.user._id,
            post: postId
        });

        // Add comment to post
        await PetPost.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
        });

        await comment.populate('user', 'username');
        
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment' });
    }
};

export const getPostComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
};