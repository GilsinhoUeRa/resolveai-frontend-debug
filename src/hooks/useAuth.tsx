// src/hooks/useAuth.tsx (Versão Final - Apenas Contexto e Provider)

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Funções de API e Tipos
import { loginApi, registerApi } from '@/services/auth.api';
import apiClient from '@/services/api';
import { User, ProviderDetails, AuthContextType, LoginCredentials, AuthResponse, RegisterData } from '@/types';

// 1. O contexto é exportado para ser usado pelo hook em outro arquivo.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const JWT_STORAGE_KEY = 'authToken';

// 2. O AuthProvider continua a ser a peça central que encapsula a lógica.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(JWT_STORAGE_KEY));

  useEffect(() => {
    if (token) {
      localStorage.setItem(JWT_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(JWT_STORAGE_KEY);
    }
  }, [token]);

  const { data: user, isLoading: isLoadingUser } = useQuery<User | ProviderDetails, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await apiClient.get('/usuarios/me');
      return data;
    },
    enabled: !!token,
    retry: 1,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  const { mutateAsync: login, isPending: isLoggingIn } = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const { mutateAsync: register, isPending: isRegistering } = useMutation<User, Error, RegisterData>({
    mutationFn: registerApi,
    onSuccess: (newUser) => {
      console.log('Usuário registrado com sucesso:', newUser);
    },
  });

  const logout = useCallback(() => {
    setToken(null);
    queryClient.removeQueries({ queryKey: ['me'] });
    queryClient.removeQueries({ queryKey: ['favorites'] });
    queryClient.removeQueries({ queryKey: ['chatSessions'] });
  }, [queryClient]);

  const contextValue: AuthContextType = {
    user: user ?? null,
    token,
    login,
    register,
    logout,
    loading: isLoadingUser || isLoggingIn || isRegistering,
    isAdmin: user?.role === 'admin',
    setToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};