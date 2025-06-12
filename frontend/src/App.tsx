import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { theme } from './utils/theme';
import { store } from './features/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

export default App;