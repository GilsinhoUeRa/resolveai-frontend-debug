export enum UserType {
  CLIENT = 'client',
  PROVIDER = 'provider',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

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

export interface AdminUser extends User {
  role: UserRole.ADMIN;
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
  // professionId?: string; 
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export type SubscriptionPlan = 'trial' | 'free' | 'basic' | 'pro' | 'premium';
export type SubscriptionCycle = 'monthly' | 'quarterly' | 'semi_annually' | 'annually';

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
  // Subscription related fields
  subscriptionPlan?: SubscriptionPlan;
  subscriptionCycle?: SubscriptionCycle;
  trialEndsAt?: string; // ISO date string
  subscriptionEndsAt?: string; // ISO date string
  // Document fields
  documentType?: 'cpf' | 'cnpj';
  documentNumber?: string;
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
  // Adicionado para rastrear se foi a partir de um serviço confirmado
  serviceRecordId?: string; 
}

// Nova interface para simular o registro de serviço concluído
export interface CompletedServiceRecord {
  recordId: string;
  clientId: string;
  clientName?: string; // Para facilitar a exibição na lista do prestador
  providerId: string;
  providerName?: string; // Para facilitar a exibição na lista do cliente
  serviceDescription?: string;
  dateMarkedCompletedByProvider: string; // ISO Date
  dateConfirmedByClient?: string; // ISO Date
  canClientReview: boolean; // True após confirmação do cliente
}

export interface AuthContextType {
  user: User | ProviderDetails | null; 
  loading: boolean;
  isAdmin: boolean; 
  login: (email: string, pass: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'photoUrl' | 'role' | 'isActive'> & { city: string; password: string; confirmPassword?: string; photoUrl?: string, photoFile?: File | null }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: (Partial<User> | Partial<ProviderDetails>) & { id: string; photoFile?: File | null }) => Promise<void>; 
  allUsers: (User | ProviderDetails)[]; 
  subscribeToPlan: (planId: Exclude<SubscriptionPlan, 'trial' | 'free'>, cycle: SubscriptionCycle) => Promise<void>;
  checkAndUpdateSubscriptionStatus: () => void;

  // Para gerenciamento de serviços concluídos (simulação)
  completedServices: CompletedServiceRecord[];
  markServiceAsCompletedByProvider: (providerId: string, clientId: string, clientName: string, serviceDescription?: string) => Promise<CompletedServiceRecord | null>;
  confirmServiceCompletionByClient: (recordId: string) => Promise<void>;
  canLeaveReview: (providerId: string) => boolean;
  getCompletedServiceForReview: (providerId: string) => CompletedServiceRecord | undefined;
}

export interface ProfessionCategory {
  id: string; 
  name: string;
  imageUrl: string; 
  description?: string; 
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Chat related types
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
}

export interface ChatContextType {
  chatSessions: ChatSession[];
  loadingSessions: boolean;
  getMessagesForSession: (sessionId: string) => Promise<ChatMessage[]>;
  sendMessage: (sessionId: string, content: string) => Promise<ChatMessage | null>;
  startOrGetChatSession: (targetUserId: string) => Promise<string | null>; 
  isLoadingMessages: (sessionId: string) => boolean;
  markSessionAsRead: (sessionId: string) => void; 
}

// Notification related types
export interface AppNotification {
  id: string; 
  type: 'chat_message' | 'system_update' | 'new_review' | 'service_completion_request' | 'service_confirmed'; 
  title: string;
  message: string; 
  link?: string; 
  timestamp: string; 
  isRead: boolean;
  sourceId?: string; 
}

export interface AppNotificationContextType {
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

// Favorites related types
export interface FavoritesContextType {
  favoriteProviderIds: string[];
  addFavorite: (providerId: string) => void;
  removeFavorite: (providerId: string) => void;
  isFavorite: (providerId: string) => boolean;
  loadingFavorites: boolean;
}

// Tipos para Atividades Recentes
export type ActivityType = 'chat' | 'review';

export interface ActivityItem {
  id: string; 
  type: ActivityType; 
  timestamp: string; 
  title: string; 
  description?: string; 
  linkTo: string; 
  iconType: 'chat' | 'review'; 
  relatedEntityName?: string; 
  relatedEntityPhotoUrl?: string; 
}