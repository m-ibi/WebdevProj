import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { theme } from './utils/theme';
import { store } from './features/store';
import { loadUser } from './features/authSlice';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            store.dispatch(loadUser());
        }
    }, [token]);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit-profile"
                            element={
                                <ProtectedRoute>
                                    <EditProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-post"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;