import mongoose from 'mongoose';

const petPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    breed: {
        type: String,
        required: [true, 'Breed is required']
    },
    species: {
        type: String,
        required: [true, 'Species is required']
    },
    imageUrls: [{
        type: String,
        required: [true, 'At least one image is required']
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('PetPost', petPostSchema);