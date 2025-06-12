import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import PetPost from '../models/PetPost';

// Helper function for getting Cloudinary public ID
const getPublicIdFromUrl = (url: string) => {
    const splitUrl = url.split('/');
    const filename = splitUrl[splitUrl.length - 1];
    return `pet-lovers/${filename.split('.')[0]}`;
};

export const createPetPost = async (req: Request, res: Response) => {
    try {
        const { title, content, breed, species } = req.body;
        let imageUrls: string[] = [];
        
        if (req.files && Array.isArray(req.files)) {
            imageUrls = (req.files as Express.Multer.File[]).map(file => file.path);
        }

        const post = await PetPost.create({
            title,
            content,
            breed,
            species,
            imageUrls,
            user: req.user._id
        });

        await post.populate('user', 'username');
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
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

export const updatePetPost = async (req: Request, res: Response) => {
    try {
        const { title, content, breed, species } = req.body;
        const post = await PetPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this post' });
        }

        const updatedPost = await PetPost.findByIdAndUpdate(
            req.params.id,
            { title, content, breed, species },
            { new: true }
        ).populate('user', 'username');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
};

export const deletePetPost = async (req: Request, res: Response) => {
    try {
        const post = await PetPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this post' });
        }

        // Delete images from Cloudinary
        if (post.imageUrls && post.imageUrls.length > 0) {
            for (const imageUrl of post.imageUrls) {
                try {
                    const publicId = getPublicIdFromUrl(imageUrl);
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted image: ${publicId}`);
                } catch (error) {
                    console.error(`Error deleting image from Cloudinary: ${error}`);
                }
            }
        }

        await post.deleteOne();
        res.json({ message: 'Post and associated images deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

export const deletePostImage = async (req: Request, res: Response) => {
    try {
        const { postId, imageUrl } = req.body;
        const post = await PetPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete images from this post' });
        }

        if (!post.imageUrls.includes(imageUrl)) {
            return res.status(404).json({ message: 'Image not found in post' });
        }

        const publicId = getPublicIdFromUrl(imageUrl);
        await cloudinary.uploader.destroy(publicId);

        post.imageUrls = post.imageUrls.filter(url => url !== imageUrl);
        await post.save();

        res.json({ 
            message: 'Image deleted successfully', 
            remainingImages: post.imageUrls 
        });
    } catch (error) {
        console.error('Image deletion error:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
};

export const likePetPost = async (req: Request, res: Response) => {
    try {
        const post = await PetPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        post.likes.push(req.user._id);
        await post.save();

        res.json({ likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'Error liking post' });
    }
};

export const unlikePetPost = async (req: Request, res: Response) => {
    try {
        const post = await PetPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'Post has not been liked yet' });
        }

        post.likes = post.likes.filter(
            (like) => like.toString() !== req.user._id.toString()
        );
        await post.save();

        res.json({ likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'Error unliking post' });
    }
};

export const searchPosts = async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.query as string;
        
        if (!searchQuery) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const posts = await PetPost.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        })
        .populate('user', 'username')
        .sort({ createdAt: -1 });

        res.json({ posts, count: posts.length });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching posts' });
    }
};

export const filterPosts = async (req: Request, res: Response) => {
    try {
        const { species, breed } = req.query;
        const filter: any = {};

        if (species) filter.species = species;
        if (breed) filter.breed = breed;

        const posts = await PetPost.find(filter)
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering posts' });
    }
};