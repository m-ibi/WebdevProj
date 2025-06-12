// filepath: d:\Dev\WebdevProj\frontend\src\services\auth.service.ts
import api from '../utils/api';
import { User } from '../types';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    username: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/users/profile');
        return response.data;
    }
};