// Dentro de useAuth.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User, AuthContextType, ProviderDetails, UserType, UserRole, AdminUser, SubscriptionPlan, SubscriptionCycle, CompletedServiceRecord, Review, ToastType } from '@/types';
import { APP_ROUTES, PRICING_PLANS_DETAILS, TRIAL_DURATION_DAYS } from '@/constants';
import api from '@/services/api'; // Importe sua instância do Axios

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const JWT_STORAGE_KEY = 'resolveai_jwt_token';
const COMPLETED_SERVICES_STORAGE_KEY_PREFIX = 'resolveai_completed_services_'; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// For mocking purposes, let's create a small list of users here.
// In a real app, this would come from an API.
const MOCK_USER_DATABASE: (User | ProviderDetails)[] = [
  { id: 'client1_auth_mock', name: 'Cliente Mock Um', email: 'client1@example.com', userType: UserType.CLIENT, city: 'CidadeA', isActive: true, role: UserRole.USER },
  { id: 'client2_auth_mock', name: 'Cliente Mock Dois', email: 'client2@example.com', userType: UserType.CLIENT, city: 'CidadeB', isActive: true, role: UserRole.USER },
  { 
    id: 'provider1_auth_mock', name: 'Prestador Mock Um', email: 'provider1_auth@example.com', 
    userType: UserType.PROVIDER, city: 'CidadeA', 
    profession: {id: '1', name: 'Encanador', description: 'Serviços de encanamento.'}, 
    specialties: [{id: 'sp1', name: 'Reparos de Vazamento'}], 
    workingHours: '9-17h', paymentMethods: [{id:'pix', name:'PIX'}], 
    isActive: true, role: UserRole.USER 
  },
  { id: 'admin@resolveai.com', name: 'Admin User', email: 'admin@resolveai.com', userType: UserType.CLIENT, role: UserRole.ADMIN, isActive: true, city: 'AdminCity' },
];


const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | ProviderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem(JWT_STORAGE_KEY));
  const [completedServices, setCompletedServices] = useState<CompletedServiceRecord[]>([]);

  // This will be the source for 'allUsers' checks within this provider and for the context.
  // In a real app, this would be fetched and managed more robustly. For now, it's a mock.
  const [internalAllUsers, setInternalAllUsers] = useState<(User | ProviderDetails)[]>(() => {
    // Attempt to load from localStorage or default to MOCK_USER_DATABASE
    // This allows some persistence of user changes (like isActive) during development
    // but isn't a full backend replacement.
    const storedUsers = localStorage.getItem('resolveai_users_temp_mock');
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch {
        return MOCK_USER_DATABASE;
      }
    }
    return MOCK_USER_DATABASE;
  });

  // Persist internalAllUsers to localStorage for mock purposes
  useEffect(() => {
    localStorage.setItem('resolveai_users_temp_mock', JSON.stringify(internalAllUsers));
  }, [internalAllUsers]);

  // Local mock for addToast, to be used by methods within AuthProvider
  const addToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => { 
    console.log(`Auth Internal Toast [${type}]: ${message}${duration ? ` (Duration: ${duration})` : ''}`); 
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(JWT_STORAGE_KEY);
    if (storedToken) {
      const decodedToken = parseJwt(storedToken);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        // Try to find the full user details from our mock/internal list
        let userFromDb = internalAllUsers.find(u => u.id === decodedToken.sub);

        if (!userFromDb) { // If not in DB, create a partial one from token (basic fallback)
            userFromDb = {
                id: decodedToken.sub, email: decodedToken.email, name: decodedToken.name,
                role: decodedToken.role, userType: decodedToken.userType,
            } as User | ProviderDetails;
        }
        
        setUser(userFromDb);
        setToken(storedToken);
        setIsAdmin(userFromDb.role === UserRole.ADMIN && userFromDb.email === 'admin@resolveai.com');

        const servicesStorageKey = `${COMPLETED_SERVICES_STORAGE_KEY_PREFIX}${decodedToken.sub}`;
        const storedCompletedServices = localStorage.getItem(servicesStorageKey);
        setCompletedServices(storedCompletedServices ? JSON.parse(storedCompletedServices) : []);
      } else {
        localStorage.removeItem(JWT_STORAGE_KEY);
        setUser(null); setToken(null); setIsAdmin(false); setCompletedServices([]);
      }
    }
    setLoading(false);
  }, [internalAllUsers]); // Add internalAllUsers as dependency, if user details depend on it.


  useEffect(() => {
    if (token) {
      localStorage.setItem(JWT_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(JWT_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user && completedServices.length > 0) { 
        const servicesStorageKey = `${COMPLETED_SERVICES_STORAGE_KEY_PREFIX}${user.id}`;
        localStorage.setItem(servicesStorageKey, JSON.stringify(completedServices));
    } else if (user && completedServices.length === 0) { 
        const servicesStorageKey = `${COMPLETED_SERVICES_STORAGE_KEY_PREFIX}${user.id}`;
        localStorage.removeItem(servicesStorageKey);
    }
  }, [completedServices, user]);


  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call for login by finding user in MOCK_USER_DATABASE
      // In a real app, this would be:
      // const response = await fetch(`${API_BASE_URL}/auth/login`, { /* ... */ });
      // const data = await response.json();
      
      const foundUser = internalAllUsers.find(u => u.email === email); // Password check omitted for mock
      
      if (foundUser) {
        // Simulate token generation
        const mockTokenPayload = { sub: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role, userType: foundUser.userType, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
        const mockAccessToken = `mockHeader.${btoa(JSON.stringify(mockTokenPayload))}.mockSignature`;
        
        setToken(mockAccessToken);
        setUser(foundUser);
        setIsAdmin(foundUser.role === UserRole.ADMIN && foundUser.email === 'admin@resolveai.com');
        
        const servicesStorageKey = `${COMPLETED_SERVICES_STORAGE_KEY_PREFIX}${foundUser.id}`;
        const storedCompletedServices = localStorage.getItem(servicesStorageKey);
        setCompletedServices(storedCompletedServices ? JSON.parse(storedCompletedServices) : []);
      } else {
        throw new Error('Credenciais inválidas (simulado).');
      }
    } catch (error) {
      console.error("Login API error (simulated):", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, 'id' | 'photoUrl' | 'role' | 'isActive'> & { city: string; password: string; confirmPassword?: string; photoUrl?: string, photoFile?: File | null }
  ): Promise<void> => {
    setLoading(true);
    const { photoFile, photoUrl, confirmPassword, ...registrationData } = userData;
    try {
      // Simulate API call for registration
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        name: registrationData.name,
        email: registrationData.email,
        userType: registrationData.userType,
        city: registrationData.city,
        photoUrl: photoUrl || (photoFile ? URL.createObjectURL(photoFile) : undefined),
        role: UserRole.USER,
        isActive: true,
      };
      setInternalAllUsers(prev => [...prev, newUser]); // Add to our mock DB
      addToast('Registro bem-sucedido (simulado)! Por favor, faça login.', 'success');
      // In real app: await fetch(`${API_BASE_URL}/auth/register`, { /* ... */ });
    } catch (error) {
      console.error("Register API error (simulated):", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    setCompletedServices([]); 
  };
  
  const updateUser = useCallback(async (
    updateData: (Partial<User> | Partial<ProviderDetails>) & { id: string; photoFile?: File | null }
  ): Promise<void> => {
    setLoading(true);
    if (user && user.id === updateData.id) {
      const { photoFile, ...dataToMerge } = updateData;
      let newPhotoUrl = user.photoUrl;
      if (photoFile) {
        newPhotoUrl = URL.createObjectURL(photoFile);
      } else if (dataToMerge.hasOwnProperty('photoUrl')) {
        newPhotoUrl = dataToMerge.photoUrl;
      }
      
      const updatedCurrentUserFields = { ...user, ...dataToMerge, photoUrl: newPhotoUrl };
      
      // Update the user state
      setUser(updatedCurrentUserFields as User | ProviderDetails);
      
      // Update the user in internalAllUsers (mock DB)
      setInternalAllUsers(prevAllUsers => 
        prevAllUsers.map(u => 
          u.id === updateData.id ? { ...u, ...updatedCurrentUserFields } : u
        )
      );
      
      addToast('Perfil atualizado (simulado localmente). Backend necessário.', 'info');
    } else if (updateData.id) { // Case for admin updating other users
        setInternalAllUsers(prevAllUsers => 
            prevAllUsers.map(u => 
              u.id === updateData.id ? { ...u, ...updateData } : u
            )
        );
        addToast(`Perfil de ${updateData.name || 'usuário'} atualizado (simulado).`, 'info');
    }
    setLoading(false);
  }, [user, addToast]);
  
  const checkAndUpdateSubscriptionStatus = useCallback(() => {
    if (user && user.userType === UserType.PROVIDER) {
        const providerUser = user as ProviderDetails;
        let needsFrontendUpdate = false;
        let updatedPlan = providerUser.subscriptionPlan;
        if (providerUser.subscriptionPlan === 'trial' && providerUser.trialEndsAt) {
            if (new Date(providerUser.trialEndsAt) < new Date()) {
                updatedPlan = 'free'; needsFrontendUpdate = true;
            }
        } else if (providerUser.subscriptionPlan !== 'free' && providerUser.subscriptionPlan !== 'trial' && providerUser.subscriptionEndsAt) {
            if (new Date(providerUser.subscriptionEndsAt) < new Date()) {
                updatedPlan = 'free'; needsFrontendUpdate = true;
            }
        }
        if (needsFrontendUpdate && user.id === providerUser.id) {
            const updatedUser = {...providerUser, subscriptionPlan: updatedPlan } as ProviderDetails;
            setUser(updatedUser);
            setInternalAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
    }
  }, [user]);

  useEffect(() => { if (user) checkAndUpdateSubscriptionStatus(); }, [user, checkAndUpdateSubscriptionStatus]);

  const subscribeToPlan = useCallback(async (planId: Exclude<SubscriptionPlan, 'trial' | 'free'>, cycle: SubscriptionCycle): Promise<void> => {
    if (user && user.userType === UserType.PROVIDER) {
        const providerUser = user as ProviderDetails;
        const now = new Date(); let subscriptionEndDate = new Date(now);
         switch (cycle) {
          case 'monthly': subscriptionEndDate.setMonth(now.getMonth() + 1); break;
          case 'quarterly': subscriptionEndDate.setMonth(now.getMonth() + 3); break;
          case 'semi_annually': subscriptionEndDate.setMonth(now.getMonth() + 6); break;
          case 'annually': subscriptionEndDate.setFullYear(now.getFullYear() + 1); break;
        }
        const updatedProvider: ProviderDetails = {
            ...providerUser, subscriptionPlan: planId, subscriptionCycle: cycle,
            subscriptionEndsAt: subscriptionEndDate.toISOString(), trialEndsAt: undefined,
        };
        setUser(updatedProvider); 
        setInternalAllUsers(prev => prev.map(u => u.id === updatedProvider.id ? updatedProvider : u));
        addToast('Assinatura atualizada (simulado localmente). Backend necessário.', 'success');
    }
  }, [user, addToast]);

  const markServiceAsCompletedByProvider = useCallback(async (
    providerId: string, 
    clientId: string, 
    clientName: string, 
    serviceDescription?: string
  ): Promise<CompletedServiceRecord | null> => {
    if (!user || user.id !== providerId || user.userType !== UserType.PROVIDER) {
        addToast('Ação não permitida.', 'error');
        return null;
    }
    const clientExists = internalAllUsers.some(u => u.id === clientId && u.userType === UserType.CLIENT);
    if (!clientExists) {
        addToast('ID do cliente não encontrado ou inválido.', 'error');
        return null;
    }
    
    const newRecord: CompletedServiceRecord = {
        recordId: `csr_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        clientId,
        clientName, 
        providerId,
        providerName: user.name, 
        serviceDescription: serviceDescription || 'Serviço prestado',
        dateMarkedCompletedByProvider: new Date().toISOString(),
        canClientReview: false,
    };
    setCompletedServices(prev => [...prev, newRecord]);
    addToast(`Serviço para ${clientName} marcado como concluído. Aguardando confirmação do cliente.`, 'success');
    return newRecord;
  }, [user, internalAllUsers, addToast]);

  const confirmServiceCompletionByClient = useCallback(async (recordId: string): Promise<void> => {
    if (!user) {
        addToast('Você precisa estar logado.', 'error');
        return;
    }
    setCompletedServices(prev => 
        prev.map(record => 
            record.recordId === recordId && record.clientId === user.id 
            ? { ...record, canClientReview: true, dateConfirmedByClient: new Date().toISOString() } 
            : record
        )
    );
    addToast('Serviço confirmado! Você já pode deixar uma avaliação.', 'success');
  }, [user, addToast]);

  const canLeaveReview = useCallback((providerId: string): boolean => {
    if (!user) return false;
    return completedServices.some(record => 
        record.clientId === user.id && 
        record.providerId === providerId && 
        record.canClientReview === true
    );
  }, [user, completedServices]);

  const getCompletedServiceForReview = useCallback((providerId: string): CompletedServiceRecord | undefined => {
    if (!user) return undefined;
    return completedServices.find(record =>
      record.clientId === user.id &&
      record.providerId === providerId &&
      record.canClientReview === true
    );
  }, [user, completedServices]);
  
  const contextValue: AuthContextType = { 
    user, loading, isAdmin, login, register, logout, updateUser, 
    allUsers: internalAllUsers, 
    subscribeToPlan, checkAndUpdateSubscriptionStatus,
    completedServices, markServiceAsCompletedByProvider, confirmServiceCompletionByClient, canLeaveReview, getCompletedServiceForReview
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
