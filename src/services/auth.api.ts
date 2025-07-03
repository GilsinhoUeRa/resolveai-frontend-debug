// src/services/auth.api.ts

import apiClient from './api'; // Importamos nossa instância unificada do Axios
import { LoginCredentials, AuthResponse, RegisterData, User } from '@/types'; // Importamos nossos tipos

/**
 * Envia as credenciais de login para a API.
 * @param credentials - O objeto contendo email e senha.
 * @returns Uma promessa que resolve para um objeto com o token JWT.
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // O caminho foi atualizado de '/login' para '/auth/login' para corresponder ao backend
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
};

/**
 * Envia os dados de um novo usuário para registro na API.
 * @param registerData - O objeto contendo os dados do novo usuário.
 * @returns Uma promessa que resolve para o objeto do usuário criado.
 */
export const registerApi = async (registerData: RegisterData): Promise<User> => {
    const { data } = await apiClient.post<User>('/usuarios', registerData);
    return data;
};