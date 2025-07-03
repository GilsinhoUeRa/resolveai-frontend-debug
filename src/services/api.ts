// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Esta é a correção crucial. Este código é executado antes de CADA pedido.
apiClient.interceptors.request.use(
    (config) => {
        // Busca o token mais recente do localStorage a cada pedido.
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;