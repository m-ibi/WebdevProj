import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

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
                    {user ? (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/profile"
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