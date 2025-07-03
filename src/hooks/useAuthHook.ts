// src/hooks/useAuthHook.ts (Versão Final - Apenas o Hook)

import { useContext } from 'react';
import { AuthContext } from './useAuth'; // Importa o CONTEXTO do outro arquivo
import { AuthContextType } from '@/types';

/**
 * Hook customizado para acessar o contexto de autenticação em qualquer
 * componente da aplicação.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};