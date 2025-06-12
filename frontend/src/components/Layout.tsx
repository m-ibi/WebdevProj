import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Box>
            <Navbar />
            <Container component="main" sx={{ mt: 4, mb: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;