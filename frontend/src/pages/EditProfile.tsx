import { useState, useEffect, ChangeEvent } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    TextField, 
    Button, 
    Avatar, 
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import api from '../utils/api';
import { loadUser } from '../features/authSlice';

interface ProfileFormData {
    username: string;
    email: string;
    bio: string;
}

const EditProfile = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<ProfileFormData>({
        username: '',
        email: '',
        bio: ''
    });
    
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || ''
            });
            
            if (user.profilePicture) {
                setImagePreview(user.profilePicture);
            }
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            
            // Create URL for preview
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview && !user?.profilePicture) {
            URL.revokeObjectURL(imagePreview);
        }
        
        setProfileImage(null);
        setImagePreview(user?.profilePicture || null);
    };

    const handleDeleteProfilePicture = async () => {
        try {
            setLoading(true);
            await api.delete('/users/profile-picture');
            
            setImagePreview(null);
            setSuccess('Profile picture deleted successfully');
            
            // Reload user data to update state
            await dispatch(loadUser());
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete profile picture');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);
            
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('bio', formData.bio);
            
            if (profileImage) {
                formDataToSend.append('profilePicture', profileImage);
            }
            
            await api.put('/users/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setSuccess('Profile updated successfully');
            
            // Reload user data to update state
            await dispatch(loadUser());
            
            // Navigate back to profile page after short delay
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Edit Profile
                </Typography>
                
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    
                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                src={imagePreview || undefined}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                >
                                    Change Photo
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                
                                {imagePreview && (
                                    <>
                                        {profileImage ? (
                                            <Button 
                                                variant="outlined" 
                                                color="error"
                                                onClick={handleRemoveImage}
                                            >
                                                Cancel
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outlined" 
                                                color="error"
                                                onClick={handleDeleteProfilePicture}
                                                disabled={loading}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                        
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/profile')}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default EditProfile;