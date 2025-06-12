import { AppBar, Box, Toolbar, Typography, Button, IconButton, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    Pet Lovers
                </Typography>
                <Box>
                    {token ? (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/create-post"
                                sx={{ mr: 1 }}
                            >
                                New Post
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/profile"
                                sx={{ mr: 1 }}
                                startIcon={
                                    user?.profilePicture ? (
                                        <Avatar 
                                            src={user.profilePicture} 
                                            sx={{ width: 24, height: 24 }}
                                        />
                                    ) : null
                                }
                            >
                                Profile
                            </Button>
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                                sx={{ mr: 1 }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;