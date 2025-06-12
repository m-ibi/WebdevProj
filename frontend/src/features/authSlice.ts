import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';
import { authService } from '../services/auth.service';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const response = await authService.login({ email, password });
        localStorage.setItem('token', response.token);
        return response;
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }: { username: string; email: string; password: string }) => {
        const response = await authService.register({ username, email, password });
        localStorage.setItem('token', response.token);
        return response;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;