import { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardMedia, 
    Divider, 
    Avatar, 
    Button, 
    TextField,
    CircularProgress,
    IconButton
} from '@mui/material';
import { Favorite, FavoriteBorder, Send } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import api from '../utils/api';
import { Post, Comment } from '../types';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { user, token } = useAppSelector((state) => state.auth);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/pets/${id}`);
            setPost(response.data);
        } catch (err) {
            setError('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleLike = async () => {
        if (!token || !post) return;

        try {
            const isLiked = post.likes.includes(user?._id || '');
            const endpoint = isLiked ? `/pets/${post._id}/unlike` : `/pets/${post._id}/like`;
            
            await api.put(endpoint);
            
            // Update post likes locally
            setPost(prev => {
                if (!prev) return null;
                
                const updatedLikes = isLiked
                    ? prev.likes.filter(id => id !== user?._id)
                    : [...prev.likes, user?._id || ''];
                    
                return {
                    ...prev,
                    likes: updatedLikes
                };
            });
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !token || !post) return;

        try {
            setSubmitting(true);
            const response = await api.post(`/comments/${post._id}`, { content: comment });
            
            // Update post with new comment
            setPost(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    comments: [...prev.comments, response.data]
                };
            });
            
            setComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextImage = () => {
        if (post && currentImageIndex < post.imageUrls.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !post) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="error">{error || 'Post not found'}</Typography>
            </Box>
        );
    }

    const isLiked = post.likes.includes(user?._id || '');

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Card sx={{ mb: 4 }}>
                    {post.imageUrls.length > 0 && (
                        <Box sx={{ position: 'relative' }}>
                            <CardMedia
                                component="img"
                                height="400"
                                image={post.imageUrls[currentImageIndex]}
                                alt={post.title}
                                sx={{ objectFit: 'contain' }}
                            />
                            {post.imageUrls.length > 1 && (
                                <Box 
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: 10, 
                                        left: 0, 
                                        right: 0, 
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 1
                                    }}
                                >
                                    {post.imageUrls.map((_, index) => (
                                        <Box 
                                            key={index}
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                backgroundColor: index === currentImageIndex ? 'primary.main' : 'grey.400',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                    ))}
                                </Box>
                            )}
                            {post.imageUrls.length > 1 && (
                                <>
                                    <Button 
                                        sx={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)' }}
                                        onClick={handlePrevImage}
                                        disabled={currentImageIndex === 0}
                                    >
                                        &lt;
                                    </Button>
                                    <Button 
                                        sx={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }}
                                        onClick={handleNextImage}
                                        disabled={currentImageIndex === post.imageUrls.length - 1}
                                    >
                                        &gt;
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {post.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                                src={post.user.profilePicture}
                                sx={{ mr: 1, width: 32, height: 32 }}
                            />
                            <Typography component={Link} to={`/user/${post.user._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                {post.user.username}
                            </Typography>
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {post.content}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Species: {post.species}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Breed: {post.breed}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <IconButton onClick={handleLike} color={isLiked ? 'primary' : 'default'} disabled={!token}>
                                {isLiked ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                            <Typography variant="body2">{post.likes.length} likes</Typography>
                        </Box>
                    </Box>
                </Card>
                
                <Typography variant="h6" gutterBottom>
                    Comments ({post.comments.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {token ? (
                    <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                label="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                            <Button 
                                type="submit"
                                variant="contained"
                                disabled={!comment.trim() || submitting}
                                startIcon={<Send />}
                            >
                                Post
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link> to add a comment.
                    </Typography>
                )}
                
                {post.comments.length > 0 ? (
                    <Box>
                        {post.comments.map((comment: Comment) => (
                            <Box key={comment._id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar 
                                        src={comment.user.profilePicture}
                                        sx={{ mr: 1, width: 24, height: 24 }}
                                    />
                                    <Typography variant="body2" fontWeight="bold">
                                        {comment.user.username}
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {comment.content}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No comments yet.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default PostDetail;