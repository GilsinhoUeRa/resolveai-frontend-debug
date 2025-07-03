// src/types.ts (Versão Final, Corrigida e Unificada)
import React from 'react';

// --- ENUMS ---
export enum UserType { CLIENT = 'client', PROVIDER = 'provider' }
export enum UserRole { USER = 'user', ADMIN = 'admin' }

// --- MODELOS DE DADOS PRINCIPAIS ---
export interface User { id: string; name: string; email: string; city?: string; userType: UserType; photoUrl?: string; role?: UserRole; isActive?: boolean; }
export interface ProviderDetails extends User { /* ... (como já tinha) ... */ }
export interface Profession { id: string; name: string; description: string; }
export interface Specialty { id: string; name: string; }
export interface Category { id: string; nome: string; } // Para corresponder à API
// ... outros modelos de dados ...

// --- TIPOS DE API (Payloads e Respostas) ---
export interface LoginCredentials { email: string; senha: string; }
export interface AuthResponse { token: string; }
export interface RegisterData { nome: string; email: string; senha: string; tipo_pessoa: 'PF' | 'PJ'; documento: string; }
// ... outros payloads ...

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

// A interface que define os dados a serem enviados para a API de registo
export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo_pessoa: 'PF' | 'PJ';
  documento: string;

  // --- NOVOS CAMPOS ADICIONADOS ---
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// --- TIPOS DE CONTEXTO (ENXUTOS) ---
export interface AuthContextType {
  user: User | ProviderDetails | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
}

// --- CHATSESSION ---
export interface ChatSession {
  id: string;
  participantIds: string[];
  lastMessage?: ChatMessage;
  unreadCountByParticipant?: { [userId: string]: number };
  updatedAt: string;
  otherParticipant?: User | ProviderDetails; // <-- ADICIONE ESTA LINHA
}

// ... outros tipos de contexto ...