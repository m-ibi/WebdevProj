import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Container, CircularProgress } from '@mui/material';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import api from '../utils/api';

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/pets');
                setPosts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch posts');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Recent Pet Posts
            </Typography>
            <Box 
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 2
                }}
            >
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </Box>
        </Container>
    );
};

export default Home;