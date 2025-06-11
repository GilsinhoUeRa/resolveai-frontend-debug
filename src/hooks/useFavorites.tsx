
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { FavoritesContextType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY_PREFIX = 'resolveai_favorites_'; // Mantido para persistência local temporária

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoriteProviderIds, setFavoriteProviderIds] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true);

  const getStorageKey = useCallback(() => {
    return user ? `${FAVORITES_STORAGE_KEY_PREFIX}${user.id}` : null;
  }, [user]);

  useEffect(() => {
    setLoadingFavorites(true);
    const storageKey = getStorageKey();
    if (storageKey && user) {
      // TODO: Substituir por chamada à API: fetch('/api/favorites')
      // A API retornaria a lista de IDs de provedores favoritados pelo usuário.
      try {
        const storedFavorites = localStorage.getItem(storageKey);
        if (storedFavorites) {
          setFavoriteProviderIds(JSON.parse(storedFavorites));
        } else {
          setFavoriteProviderIds([]);
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage (mock):", error);
        setFavoriteProviderIds([]);
      }
    } else {
      setFavoriteProviderIds([]); 
    }
    setLoadingFavorites(false);
  }, [user, getStorageKey]);

  // TODO: Este useEffect de persistência será obsoleto. O backend cuidará disso.
  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey && !loadingFavorites) { 
      try {
        localStorage.setItem(storageKey, JSON.stringify(favoriteProviderIds));
      } catch (error) {
        console.error("Error saving favorites to localStorage (mock):", error);
      }
    }
  }, [favoriteProviderIds, user, loadingFavorites, getStorageKey]);

  const addFavorite = useCallback(async (providerId: string) => {
    // TODO: Substituir por chamada à API: fetch('/api/favorites', { method: 'POST', body: { providerId } })
    // A API adicionaria o favorito e retornaria sucesso/erro.
    setFavoriteProviderIds(prev => {
      if (!prev.includes(providerId)) {
        return [...prev, providerId];
      }
      return prev;
    });
    // Simula a resposta da API, idealmente o estado seria atualizado com base na resposta.
  }, []);

  const removeFavorite = useCallback(async (providerId: string) => {
    // TODO: Substituir por chamada à API: fetch(`/api/favorites/${providerId}`, { method: 'DELETE' })
    // A API removeria o favorito e retornaria sucesso/erro.
    setFavoriteProviderIds(prev => prev.filter(id => id !== providerId));
    // Simula a resposta da API.
  }, []);

  const isFavorite = useCallback((providerId: string): boolean => {
    return favoriteProviderIds.includes(providerId);
  }, [favoriteProviderIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteProviderIds, addFavorite, removeFavorite, isFavorite, loadingFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
