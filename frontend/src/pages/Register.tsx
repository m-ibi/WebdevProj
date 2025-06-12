import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { register } from '../features/authSlice';

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(register(formData)).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Register
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <TextField
                fullWidth
                label="Username"
                margin="normal"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? 'Registering...' : 'Register'}
            </Button>
            
            <Box textAlign="center">
                <Typography variant="body2">
                    Already have an account?{' '}
                    <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Register;