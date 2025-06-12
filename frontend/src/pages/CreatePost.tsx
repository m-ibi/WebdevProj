import { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import PostForm from '../components/PostForm';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            
            const response = await api.post('/pets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            navigate(`/post/${response.data._id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Create New Pet Post
                </Typography>
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <PostForm
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                </Paper>
            </Box>
        </Container>
    );
};

export default CreatePost;