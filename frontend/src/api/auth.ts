import { useMutation } from '@tanstack/react-query';
import apiClient from './client';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'student' | 'admin';
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return data;
};

const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  return data;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    },
  });
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  window.location.href = '/login';
}; 