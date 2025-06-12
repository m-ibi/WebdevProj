// filepath: d:\Dev\WebdevProj\frontend\src\utils\theme.ts
import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff4081',
            dark: '#c51162',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});