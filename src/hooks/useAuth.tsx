// src/hooks/useAuth.tsx (Versão Final Corrigida e Otimizada)

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUsuario } from '@/services/api'; // Certifique-se que esta função existe em api.ts
import { User, ProviderDetails, AuthContextType } from '@/types';
import api from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const JWT_STORAGE_KEY = 'resolveai_jwt_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(JWT_STORAGE_KEY));

  // Efeito que sincroniza o token com o localStorage e os cabeçalhos do Axios
  useEffect(() => {
    if (token) {
      localStorage.setItem(JWT_STORAGE_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(JWT_STORAGE_KEY);
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Hook para buscar os dados do usuário logado SE um token existir.
  const { data: user, isLoading } = useQuery<User | ProviderDetails, Error>({
    queryKey: ['me'], // Chave de cache para os dados do usuário autenticado
    queryFn: async () => {
      const { data } = await api.get('/usuarios/me'); // Endpoint que já criamos no backend
      return data;
    },
    enabled: !!token, // SÓ executa esta query se houver um token
    retry: 1, // Tenta apenas 1 vez em caso de falha
    staleTime: Infinity, // Considera os dados do usuário como "frescos" por tempo infinito
    gcTime: Infinity, // Impede que o cache seja limpo enquanto o usuário está logado
    refetchOnWindowFocus: false, // Evita refetch desnecessário dos dados do usuário
  });

  // MUTAÇÃO DE LOGIN
  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUsuario,
    onSuccess: (data) => {
      // Sucesso! O backend nos deu um token.
      setToken(data.token);
      // Ao setar o token, o useQuery('me') acima será ativado e buscará os dados do usuário.
      // Também invalidamos todas as queries para garantir dados frescos após o login.
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Falha no login:", error);
      // O componente de login pode usar o 'isError' do hook para mostrar a mensagem
    }
  });

  const logout = useCallback(() => {
    setToken(null);
    queryClient.clear(); // Limpa todo o cache do React Query ao deslogar
  }, [queryClient]);

  // Montamos o valor do contexto que será disponibilizado para toda a aplicação
  const contextValue: AuthContextType = {
    user: user ?? null, // Para os componentes, eles recebem 'user' ou 'null'
    token,
    login,
    logout,
    loading: isLoading || isLoggingIn,
    isAdmin: user?.role === 'ADMIN',
    // Futuramente, as funções de register, updateUser, etc., serão adicionadas aqui.
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ESTA É A EXPORTAÇÃO QUE ESTAVA FALTANDO OU INCORRETA
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};