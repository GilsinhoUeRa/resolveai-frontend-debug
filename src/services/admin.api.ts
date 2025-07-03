// src/services/admin.api.ts
import apiClient from './api';
import { Category, Profession, Specialty, User, ProviderDetails } from '@/types';

// --- DASHBOARD ---
export interface DashboardStats {
    totalUsers: number;
    totalProviders: number;
    totalProfessions: number;
    totalSpecialties: number;
    totalCategories: number;
}

export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/admin/stats');
    return data;
};

// --- USERS ---
export const getUsersApi = async (): Promise<(User | ProviderDetails)[]> => {
    const { data } = await apiClient.get('/usuarios');
    return data;
};

export const updateUserStatusApi = async ({ userId, isActive }: { userId: string; isActive: boolean }): Promise<User> => {
    const { data } = await apiClient.patch(`/usuarios/${userId}`, { isActive });
    return data;
};

// --- CATEGORIES ---
export const getCategoriesApi = async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categorias');
    return data;
};

export const createCategoryApi = async (nome: string): Promise<Category> => {
    const { data } = await apiClient.post('/categorias', { nome });
    return data;
};

export const updateCategoryApi = async ({ id, nome }: { id: string, nome: string }): Promise<Category> => {
    const { data } = await apiClient.patch(`/categorias/${id}`, { nome });
    return data;
};

export const deleteCategoryApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/categorias/${id}`);
};

// --- PROFESSIONS ---
export const getProfessionsApi = async (): Promise<Profession[]> => {
    const { data } = await apiClient.get('/profissoes');
    return data;
};

export const createProfessionApi = async (
    professionData: { nome: string, descricao: string }
): Promise<Profession> => {
    const { data } = await apiClient.post('/profissoes', professionData);
    return data;
};

export const updateProfessionApi = async ({ id, nome, descricao }: {
    id: string;
    nome: string;
    descricao: string;
}): Promise<Profession> => {
    const { data } = await apiClient.patch(`/profissoes/${id}`, { nome, descricao });
    return data;
};

export const deleteProfessionApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/profissoes/${id}`);
};

// --- SPECIALTIES ---
export const getSpecialtiesApi = async (): Promise<Specialty[]> => {
    const { data } = await apiClient.get('/especialidades');
    return data;
};

export const createSpecialtyApi = async (nome: string): Promise<Specialty> => {
    const { data } = await apiClient.post('/especialidades', { nome });
    return data;
};

export const updateSpecialtyApi = async ({ id, nome }: { id: string, nome: string }): Promise<Specialty> => {
    const { data } = await apiClient.patch(`/especialidades/${id}`, { nome });
    return data;
};

export const deleteSpecialtyApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/especialidades/${id}`);
};