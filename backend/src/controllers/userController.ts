import { Request, Response } from 'express';
import User from '../models/User';
import PetPost from '../models/PetPost';
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        console.log('Attempting to fetch user profile for ID:', req.user._id);

        const user = await User.findById(req.user._id)
            .select('-password')
            .lean();  // Use lean() for better performance
        
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure bio exists
        const userWithDefaults = {
            ...user,
            bio: user.bio || '',
            profilePicture: user.profilePicture || null
        };

        // Get user's posts
        const posts = await PetPost.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        const userResponse = {
            ...userWithDefaults,
            posts
        };
        
        console.log('Successfully fetched user profile');
        res.json(userResponse);
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ 
            message: 'Error fetching user profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { username, email, bio } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (bio) user.bio = bio;

        // Handle profile picture upload if present
        if (req.file) {
            // Delete old profile picture if exists
            if (user.profilePicture) {
                const publicId = user.profilePicture.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
                }
            }
            user.profilePicture = req.file.path;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PetPost.find({ user: req.user._id })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user posts' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        console.log('Attempting to fetch user with ID:', req.params.id);

        const user = await User.findById(req.params.id)
            .select('-password')
            .lean();
        
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's posts separately
        const posts = await PetPost.find({ user: req.params.id })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 })
            .lean();

        // Format response with defaults
        const userResponse = {
            ...user,
            bio: user.bio || '',
            profilePicture: user.profilePicture || null,
            posts
        };

        console.log('Successfully fetched user and their posts');
        res.json(userResponse);
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ 
            message: 'Error fetching user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const deleteProfilePicture = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture) {
            const publicId = user.profilePicture.split('/').pop()?.split('.')[0];
            if (publicId) {
                await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
            }
            user.profilePicture = undefined;
            await user.save();
        }

        res.json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile picture' });
    }
};