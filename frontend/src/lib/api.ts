import axios from 'axios';
import { Blueprint, Contract } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5140/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to add mock role header
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const role = localStorage.getItem('user-role') || 'Admin';
        config.headers['X-User-Role'] = role;
    }
    return config;
});

export const blueprintApi = {
    getAll: () => api.get<Blueprint[]>('/blueprints'),
    getById: (id: string) => api.get<Blueprint>(`/blueprints/${id}`),
    create: (data: Partial<Blueprint>) => api.post<Blueprint>('/blueprints', data),
};

export const contractApi = {
    getAll: () => api.get<Contract[]>('/contracts'),
    getById: (id: string) => api.get<Contract>(`/contracts/${id}`),
    create: (data: Partial<Contract>) => api.post<Contract>('/contracts', data),
    updateData: (id: string, fieldData: Record<string, string | number | boolean | null>) =>
        api.put(`/contracts/${id}/data`, { fieldData }),
    transition: (id: string, newStatus: string) =>
        api.post(`/contracts/${id}/transition`, { newStatus }),
};

export default api;
