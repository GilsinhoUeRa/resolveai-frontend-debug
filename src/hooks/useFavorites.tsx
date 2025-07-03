// src/hooks/useFavorites.tsx (Refatorado com TanStack Query)

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { FavoritesContextType } from '@/types';
import { getFavorites, addFavoriteApi, removeFavoriteApi } from '@/services/favorites.api'; // Caminho correto para o novo módulo

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addToast } = useToast();

  // 1. BUSCA (Query) a lista de IDs de favoritos da nossa nova API
  const { data: favoriteProviderIds = [], isLoading: loadingFavorites } = useQuery<string[]>({
    // A chave da query depende do ID do usuário para ser única
    queryKey: ['favorites', user?.id],
    queryFn: getFavorites,
    // A query só será executada se houver um usuário logado
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  // 2. MUTAÇÃO para ADICIONAR um favorito
  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteApi,
    onSuccess: () => {
      // Invalida a query de favoritos para buscar a lista atualizada
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      addToast('Adicionado aos favoritos!', 'success');
    },
    onError: (error: any) => {
      addToast(error.response?.data?.erro || 'Erro ao adicionar favorito.', 'error');
    },
  });

  // 3. MUTAÇÃO para REMOVER um favorito
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavoriteApi,
    onSuccess: () => {
      // Invalida a query para buscar a lista atualizada
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      addToast('Removido dos favoritos.', 'info');
    },
    onError: (error: any) => {
      addToast(error.response?.data?.erro || 'Erro ao remover favorito.', 'error');
    },
  });

  // Função para verificar se um ID está na lista de favoritos
  const isFavorite = (providerId: string) => favoriteProviderIds.includes(providerId);

  const value = {
    favoriteProviderIds,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isFavorite,
    loadingFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};