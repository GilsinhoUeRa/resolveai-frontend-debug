// src/types.ts (Versão Final, Corrigida e Unificada)
import React from 'react';

// --- ENUMS ---
export enum UserType {
  CLIENT = 'client',
  PROVIDER = 'provider',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// --- MODELOS DE DADOS PRINCIPAIS ---

export interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  userType: UserType;
  photoUrl?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ProviderDetails extends User {
  userType: UserType.PROVIDER;
  whatsApp: string;
  profession: Profession;
  specialties: Specialty[];
  workingHours: string;
  paymentMethods: PaymentMethod[];
  bio?: string;
  averageRating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isTopRated?: boolean;
  isVerified?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionCycle?: SubscriptionCycle;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  documentType?: 'cpf' | 'cnpj';
  documentNumber?: string;
}

export interface Profession {
  id: string;
  name: string;
  description: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Specialty {
  id: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  clientPhotoUrl?: string;
  providerId: string;
  rating: number;
  comment: string;
  date: string;
  serviceRecordId?: string;
}

export interface Category {
  id: string;
  nome: string;
}

// --- TIPOS DE API (Payloads e Respostas) ---

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo_pessoa: 'PF' | 'PJ';
  documento: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface ProviderProfilePayload {
  profissao_id: number;
  bio: string;
  whatsapp?: string;
  horario_atendimento?: string;
}

export interface NovaAvaliacaoPayload {
  nota: number;
  comentario: string;
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
  setToken: (token: string | null) => void;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

export interface ChatSession {
  id: string;
  participantIds: string[];
  lastMessage?: ChatMessage;
  unreadCountByParticipant?: { [userId: string]: number };
  updatedAt: string;
  otherParticipant?: User | ProviderDetails;
}

// ... outros tipos de contexto ...


// --- OUTROS TIPOS ---

export type SubscriptionPlan = 'trial' | 'free' | 'basic' | 'pro' | 'premium';
export type SubscriptionCycle = 'monthly' | 'quarterly' | 'semi_annually' | 'annually';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}