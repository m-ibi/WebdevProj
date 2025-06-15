import { AppBar, Box, Toolbar, Typography, Button, Avatar, useMediaQuery, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../features/authSlice';
import SearchBar from './SearchBar';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state) => state.auth);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleMenuClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        mr: 2
                    }}
                >
                    Pet Lovers
                </Typography>
                
                {!isMobile && <SearchBar />}
                
                <Box sx={{ flexGrow: 1 }} />
                
                {isMobile ? (
                    <>
                        <IconButton
                            color="inherit"
                            onClick={handleMenuOpen}
                            edge="end"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {token ? (
                                <>
                                    <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem component={RouterLink} to="/create-post" onClick={handleMenuClose}>
                                        New Post
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
                                        Login
                                    </MenuItem>
                                    <MenuItem component={RouterLink} to="/register" onClick={handleMenuClose}>
                                        Register
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </>
                ) : (
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
                )}
            </Toolbar>
            {isMobile && (
                <Box sx={{ px: 2, pb: 2 }}>
                    <SearchBar />
                </Box>
            )}
        </AppBar>
    );
};

export default Navbar;