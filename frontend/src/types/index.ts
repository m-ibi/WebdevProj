export interface User {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: string;
}

export interface Post {
    _id: string;
    title: string;
    content: string;
    breed: string;
    species: string;
    imageUrls: string[];
    user: User;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    _id: string;
    content: string;
    user: User;
    post: string;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}