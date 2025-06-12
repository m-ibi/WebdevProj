import { Request, Response } from 'express';
import PetPost from '../models/PetPost';

export const createPetPost = async (req: Request, res: Response) => {
    try {
        const { title, content, breed, species } = req.body;
        const post = await PetPost.create({
            title,
            content,
            breed,
            species,
            imageUrls: req.body.imageUrls || [],
            user: req.user._id
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};

export const getPetPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PetPost.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

export const getPetPostById = async (req: Request, res: Response) => {
    try {
        const post = await PetPost.findById(req.params.id)
            .populate('user', 'username')
            .populate('comments');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post' });
    }
};