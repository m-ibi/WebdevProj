import { useState, useEffect } from 'react';
import { Box, Typography, Button, Avatar, Container, Divider, CircularProgress } from '@mui/material';
import { useAppSelector } from '../hooks/redux';
import api from '../utils/api';
import { Post } from '../types';
import PostCard from '../components/PostCard';

const Profile = () => {
    const { user, token } = useAppSelector((state) => state.auth);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/posts');
                setUserPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserPosts();
        }
    }, [token]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {/* Profile layout using Box instead of Grid */}
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3
                    }}
                >
                    {/* Profile info section */}
                    <Box 
                        sx={{
                            width: { xs: '100%', md: '30%' },
                            textAlign: 'center'
                        }}
                    >
                        <Avatar
                            src={user?.profilePicture}
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            {user?.username}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                            {user?.email}
                        </Typography>
                        {user?.bio && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {user.bio}
                            </Typography>
                        )}
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            component="a"
                            href="/edit-profile"
                        >
                            Edit Profile
                        </Button>
                    </Box>

                    {/* Posts section */}
                    <Box 
                        sx={{ 
                            width: { xs: '100%', md: '70%' }
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            My Posts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {userPosts.length === 0 ? (
                            <Typography variant="body1" sx={{ my: 4 }}>
                                You haven't created any posts yet.
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)'
                                    },
                                    gap: 2
                                }}
                            >
                                {userPosts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;