import { useEffect, useState } from 'react';
import { Box, Typography, Container, CircularProgress, Chip, Button } from '@mui/material';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import api from '../utils/api';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();

    // Get search params
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query') || '';
    const species = searchParams.get('species') || '';
    const sort = searchParams.get('sort') || 'newest';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Build query string for API
                const queryParams = new URLSearchParams();
                if (query) queryParams.append('search', query);
                if (species) queryParams.append('species', species);
                if (sort) queryParams.append('sort', sort);
                
                const response = await api.get(`/pets?${queryParams.toString()}`);
                setPosts(response.data);
            } catch (err) {
                setError('Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [query, species, sort]);

    const clearFilters = () => {
        window.location.href = '/';
    };

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
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        {query ? `Search: ${query}` : 'Recent Pet Posts'}
                    </Typography>
                    
                    {(query || species || sort !== 'newest') && (
                        <Button variant="outlined" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </Box>
                
                {(query || species) && (
                    <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {query && (
                            <Chip label={`Search: ${query}`} onDelete={clearFilters} />
                        )}
                        {species && (
                            <Chip label={`Species: ${species}`} onDelete={clearFilters} />
                        )}
                        {sort !== 'newest' && (
                            <Chip 
                                label={`Sort: ${sort === 'oldest' ? 'Oldest First' : 'Most Popular'}`} 
                                onDelete={clearFilters} 
                            />
                        )}
                    </Box>
                )}
                
                {posts.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6">No posts found</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your search or filters
                        </Typography>
                    </Box>
                ) : (
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
                )}
            </Box>
        </Container>
    );
};

export default Home;