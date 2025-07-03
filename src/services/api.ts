// src/services/api.ts

import axios from 'axios';

// 1. Criação de UMA ÚNICA instância do Axios.
// Esta será a "fonte da verdade" para todas as chamadas de API.
const apiClient = axios.create({
    // 2. A URL base é lida de uma variável de ambiente, tornando o código
    //    agnóstico ao ambiente (desenvolvimento ou produção).
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000, // Tempo máximo de espera para uma requisição
});

// 3. Aplicação do Interceptor de Autenticação GLOBAL.
// Este código é executado ANTES de CADA requisição feita pelo apiClient.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Busca o token
        if (token) {
            // Se o token existir, ele é adicionado ao cabeçalho de autorização.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // A requisição continua com o cabeçalho modificado (ou não).
    },
    (error) => {
        // Em caso de erro na configuração da requisição, ele é rejeitado.
        return Promise.reject(error);
    }
);

// Exportamos a única instância configurada para ser usada em toda a aplicação.
export default apiClient;