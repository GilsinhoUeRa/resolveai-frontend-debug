import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ProviderDetails, Review as ReviewType, UserType, SubscriptionPlan, SubscriptionCycle, User } from '@/types';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';
import { APP_ROUTES, COLORS, PRICING_PLANS_DETAILS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useChat } from '@/hooks/useChat'; 
import Textarea from '@/components/Textarea';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton';
import CheckShieldIcon from '@/components/icons/CheckShieldIcon';
import SparkleIcon from '@/components/icons/SparkleIcon'; 
import MessageSquareIcon from '@/components/icons/MessageSquareIcon'; 
import HeartIcon from '@/components/icons/HeartIcon'; 
import { useFavorites } from '@/hooks/useFavorites'; 
import Modal from '@/components/Modal'; // Importar Modal
import Input from '@/components/Input'; // Importar Input para o modal

const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, allUsers, loading: authLoading, canLeaveReview, getCompletedServiceForReview, markServiceAsCompletedByProvider } = useAuth();
  const { addToast } = useToast();
  const { startOrGetChatSession } = useChat();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { favoriteProviderIds, addFavorite, removeFavorite, isFavorite, loadingFavorites } = useFavorites();

  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const isCurrentlyFavorite = providerId ? isFavorite(providerId) : false;

  // Estados para o modal de "Marcar Serviço Concluído"
  const [isMarkServiceModalOpen, setIsMarkServiceModalOpen] = useState(false);
  const [markServiceClientId, setMarkServiceClientId] = useState('');
  const [markServiceClientName, setMarkServiceClientName] = useState(''); // Adicionado
  const [markServiceDescription, setMarkServiceDescription] = useState('');
  const [markServiceError, setMarkServiceError] = useState<string | null>(null);
  const [isMarkingService, setIsMarkingService] = useState(false);
  
  const userCanLeaveReview = providerId ? canLeaveReview(providerId) : false;


  const handleToggleFavorite = () => {
    if (!providerId) return;
    if (isCurrentlyFavorite) {
      removeFavorite(providerId); 
      addToast(`${provider?.name || 'Prestador'} removido dos favoritos.`, 'info');
    } else {
      addFavorite(providerId); 
      addToast(`${provider?.name || 'Prestador'} adicionado aos favoritos!`, 'success');
    }
  };

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true); 
      return;
    }
    setIsLoading(true);

    setTimeout(() => { 
      let foundProvider: ProviderDetails | undefined = undefined;

      if (providerId) {
        foundProvider = allUsers.find(
          (u) => u.id === providerId && u.userType === UserType.PROVIDER
        ) as ProviderDetails | undefined; 
      }

      if (foundProvider) {
        setProvider(foundProvider);
        const mockReviewsForProvider = localStorage.getItem('resolveai_mock_reviews'); 
        const allMockReviews: ReviewType[] = mockReviewsForProvider ? JSON.parse(mockReviewsForProvider) : [];
        setReviews(allMockReviews.filter(r => r.providerId === providerId)
                                 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      } else {
        setProvider(null); 
        setReviews([]);
        addToast('Perfil de prestador não encontrado.', 'error');
      }
      setIsLoading(false);
    }, 800); 
  }, [providerId, allUsers, authLoading, addToast]);

  const handleWhatsAppContact = () => {
    if (provider?.whatsApp) {
      window.open(`https://wa.me/${provider.whatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${provider.name}, encontrei seu perfil no ResolveAi e gostaria de mais informações.`)}`, '_blank');
    } else {
      addToast('Número de WhatsApp não disponível.', 'warning');
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      addToast('Você precisa estar logado para iniciar uma conversa.', 'error');
      navigate(APP_ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    if (!provider || user.id === provider.id) {
      addToast('Não é possível iniciar uma conversa com este usuário.', 'error');
      return;
    }
    setStartingChat(true);
    try {
      const sessionId = await startOrGetChatSession(provider.id); 
      if (sessionId) {
        navigate(`${APP_ROUTES.CHAT_CONVERSATION}/${sessionId}`);
      } else {
        addToast('Não foi possível iniciar la conversa. Tente novamente.', 'error');
      }
    } catch (error) {
      console.error("Error starting chat session:", error);
      addToast('Ocorreu um erro ao tentar iniciar a conversa.', 'error');
    } finally {
      setStartingChat(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setReviewError("Você precisa estar logado para deixar uma avaliação.");
        addToast("Você precisa estar logado para deixar uma avaliação.", 'error');
        return;
    }
    if (!providerId || !userCanLeaveReview) {
        setReviewError("Você não pode avaliar este prestador ou um serviço concluído ainda não foi confirmado.");
        addToast("Você não pode avaliar este prestador ou um serviço concluído ainda não foi confirmado.", 'error');
        return;
    }
    if (newReviewRating === 0) {
        setReviewError("Por favor, selecione uma nota (estrelas).");
        return;
    }
    if (!newReviewComment.trim()) {
        setReviewError("Por favor, escreva um comentário.");
        return;
    }
    setReviewError('');
    setSubmittingReview(true);

    const serviceRecord = getCompletedServiceForReview(providerId);
    if (!serviceRecord) {
        setReviewError("Não foi encontrado um registro de serviço concluído válido para esta avaliação.");
        addToast("Erro interno: Registro de serviço não encontrado.", 'error');
        setSubmittingReview(false);
        return;
    }
        
    setTimeout(() => { 
        const newReview: ReviewType = {
            id: `review_${Date.now()}`, 
            clientId: user.id,
            clientName: user.name,
            clientPhotoUrl: user.photoUrl,
            providerId: provider!.id,
            rating: newReviewRating,
            comment: newReviewComment,
            date: new Date().toISOString(),
            serviceRecordId: serviceRecord.recordId, // Vincular avaliação ao registro de serviço
        };
        setReviews(prevReviews => [newReview, ...prevReviews]);
        
        const mockReviewsForProvider = localStorage.getItem('resolveai_mock_reviews');
        let allMockReviews: ReviewType[] = mockReviewsForProvider ? JSON.parse(mockReviewsForProvider) : [];
        allMockReviews.push(newReview);
        localStorage.setItem('resolveai_mock_reviews', JSON.stringify(allMockReviews));

        setNewReviewRating(0);
        setNewReviewComment('');
        setSubmittingReview(false);
        addToast('Avaliação enviada com sucesso! (Simulado)', 'success');
    }, 1000);
  };

  // Funções para o Modal de Marcar Serviço Concluído
  const openMarkServiceModal = () => {
    setMarkServiceClientId('');
    setMarkServiceClientName('');
    setMarkServiceDescription('');
    setMarkServiceError(null);
    setIsMarkServiceModalOpen(true);
  };

  const closeMarkServiceModal = () => {
    setIsMarkServiceModalOpen(false);
  };

  const handleMarkServiceSubmit = async () => {
    if (!markServiceClientId.trim()) {
      setMarkServiceError('O ID do Cliente é obrigatório.');
      return;
    }
     if (!markServiceClientName.trim()) { // Validação do nome do cliente
      setMarkServiceError('O Nome do Cliente é obrigatório.');
      return;
    }
    setMarkServiceError(null);
    setIsMarkingService(true);
    try {
      if (provider) {
        const result = await markServiceAsCompletedByProvider(provider.id, markServiceClientId, markServiceClientName, markServiceDescription);
        if (result) {
            addToast(`Serviço para ${markServiceClientName} marcado como concluído. Cliente será notificado (simulado).`, 'success');
            closeMarkServiceModal();
        } else {
             // A mensagem de erro específica já foi mostrada pelo hook, mas pode-se adicionar uma genérica.
            // setMarkServiceError('Não foi possível marcar o serviço. Verifique os dados.');
        }
      }
    } catch (error: any) {
      setMarkServiceError(error.message || 'Erro ao marcar serviço.');
      addToast(error.message || 'Erro ao marcar serviço.', 'error');
    } finally {
      setIsMarkingService(false);
    }
  };


  const getSubscriptionBadge = (currentProvider: ProviderDetails) => {
    if (currentProvider.subscriptionPlan === 'pro' || currentProvider.subscriptionPlan === 'premium') {
      return (
        <span 
          title={`Plano ${currentProvider.subscriptionPlan === 'pro' ? 'Pro' : 'Premium'}`} 
          className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-grafite-profundo shadow"
        >
          <SparkleIcon size={12} className="mr-1" color="currentColor"/>
          {currentProvider.subscriptionPlan.toUpperCase()}
        </span>
      );
    }
    if (currentProvider.subscriptionPlan === 'trial' && currentProvider.trialEndsAt && new Date(currentProvider.trialEndsAt) > new Date()) {
      return (
        <span 
          title="Em período de teste"
          className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow"
        >
          TESTE
        </span>
      );
    }
    return null;
  };


  if (isLoading || loadingFavorites || authLoading) { 
    return <ProfilePageSkeleton />;
  }

  if (!provider) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-grafite-profundo">Prestador não encontrado</h2>
        <p className="text-cinza-neutro mt-2">O perfil que você está tentando acessar não existe ou foi removido.</p>
        <Link to={APP_ROUTES.HOME} className="mt-4 inline-block">
          <Button variant="primary">Voltar para a Página Inicial</Button>
        </Link>
      </div>
    );
  }
  
  const currentAverageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : (provider.averageRating || 0);
  const currentReviewCount = reviews.length > 0 ? reviews.length : (provider.reviewCount || 0);

  const placeholderPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=f57c00&color=fff&size=128`;
  const isVerified = provider.isVerified || (!!provider.bio && !!provider.photoUrl && (provider.specialties?.length || 0) > 0);
  const canChat = user && user.id !== provider.id;
  const isOwnerOfProfile = user && user.id === provider.id;


  return (
    <div className="container mx-auto px-2 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
            <div className="md:flex-shrink-0 p-6 md:p-8 flex flex-col items-center md:items-start">
                <img 
                    className="h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-orange-energia shadow-md" 
                    src={provider.photoUrl || placeholderPhotoUrl}
                    alt={provider.name} 
                    onError={(e) => (e.currentTarget.src = placeholderPhotoUrl)}
                />
                 <div className="mt-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start">
                        <h1 className="text-3xl md:text-4xl font-bold text-grafite-profundo mr-2">{provider.name}</h1>
                        {isVerified && (
                            <span title="Perfil Verificado" className="tooltip mr-1">
                                <CheckShieldIcon size={28} color={COLORS.SUCCESS} />
                            </span>
                        )}
                        {getSubscriptionBadge(provider)}
                        {user && user.id !== provider.id && providerId && !loadingFavorites && (
                            <button
                                onClick={handleToggleFavorite}
                                aria-label={isCurrentlyFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                className="p-1.5 hover:bg-light-bg rounded-full transition-colors ml-1"
                                title={isCurrentlyFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                                <HeartIcon isActive={isCurrentlyFavorite} size={28} />
                            </button>
                        )}
                    </div>
                    <p className="text-xl text-orange-energia font-semibold">{provider.profession?.name || 'Profissão não informada'}</p>
                    {provider.city && <p className="text-md text-cinza-neutro">{provider.city}</p>}
                 </div>
                 <div className="mt-4 flex items-center justify-center md:justify-start space-x-2">
                    <StarRating rating={currentAverageRating} readOnly size={24} />
                    <span className="text-md text-cinza-neutro">({currentAverageRating.toFixed(1)} de {currentReviewCount} {currentReviewCount === 1 ? 'avaliação' : 'avaliações'})</span>
                </div>
                <div className="mt-6 w-full md:w-auto space-y-3">
                    <Button onClick={handleWhatsAppContact} variant="primary" size="lg" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Entrar em Contato (WhatsApp)
                    </Button>
                    {canChat && (
                        <Button onClick={handleStartChat} variant="secondary" size="lg" className="w-full" isLoading={startingChat}>
                            <MessageSquareIcon size={20} className="mr-2" isActive={false} />
                            {startingChat ? 'Iniciando...' : 'Enviar Mensagem na Plataforma'}
                        </Button>
                    )}
                    {isOwnerOfProfile && (
                        <Button onClick={openMarkServiceModal} variant="ghost" size="md" className="w-full border-orange-energia text-orange-energia">
                           Marcar Serviço Concluído
                        </Button>
                    )}
                 </div>
            </div>

            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-cinza-neutro/20 flex-grow">
                 <section className="mb-6">
                    <h2 className="text-xl font-semibold text-grafite-profundo mb-2">Sobre {provider.name.split(' ')[0]}</h2>
                    <p className="text-grafite-profundo whitespace-pre-line leading-relaxed">
                        {provider.bio || 'Este prestador ainda não adicionou uma biografia detalhada.'}
                    </p>
                </section>

                {provider.specialties && provider.specialties.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-grafite-profundo mb-3">Especialidades</h2>
                        <div className="flex flex-wrap gap-2">
                        {provider.specialties.map(spec => (
                            <span key={spec.id} className="bg-orange-energia/10 text-orange-energia px-3 py-1 rounded-full text-sm font-medium">
                            {spec.name}
                            </span>
                        ))}
                        </div>
                    </section>
                )}
                
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-grafite-profundo mb-2">Horário de Atendimento</h2>
                        <p className="text-grafite-profundo">{provider.workingHours || "Não informado"}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-grafite-profundo mb-2">Formas de Pagamento</h2>
                        {provider.paymentMethods && provider.paymentMethods.length > 0 ? (
                            <ul className="list-disc list-inside text-grafite-profundo">
                                {provider.paymentMethods.map(method => (
                                    <li key={method.id}>{method.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-grafite-profundo">Não informado</p>
                        )}
                    </div>
                </section>
            </div>
        </div>

        <section className="p-6 md:p-8 border-t border-cinza-neutro/20">
          <h2 className="text-2xl font-semibold text-grafite-profundo mb-6">Avaliações de Clientes ({currentReviewCount})</h2>
          
          {user && user.userType === UserType.CLIENT && user.id !== provider.id && ( 
            userCanLeaveReview ? (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border border-cinza-neutro/30 rounded-lg bg-light-bg">
                <h3 className="text-lg font-semibold text-grafite-profundo mb-2">Deixe sua avaliação:</h3>
                <div className="mb-3">
                    <StarRating rating={newReviewRating} onRate={setNewReviewRating} size={28} />
                </div>
                <Textarea
                    label="Seu comentário:"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Descreva sua experiência com este prestador..."
                    rows={3}
                    required
                />
                {reviewError && <p className="text-sm text-red-600 mb-2">{reviewError}</p>}
                <Button type="submit" isLoading={submittingReview} variant="primary">
                    {submittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                </Button>
                </form>
            ) : (
                <div className="mb-8 p-4 border border-orange-energia/30 rounded-lg bg-orange-energia/5 text-center">
                    <p className="text-sm text-orange-energia">
                        Para avaliar este prestador, um serviço concluído entre vocês precisa ser registrado e confirmado.
                    </p>
                    <p className="text-xs text-orange-energia/80 mt-1">
                        Se o prestador já marcou o serviço como concluído, verifique seu perfil para confirmar.
                    </p>
                </div>
            )
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-cinza-neutro">Este prestador ainda não possui avaliações.</p>
          )}
        </section>
      </div>

      {/* Modal para Marcar Serviço Concluído */}
      <Modal
        isOpen={isMarkServiceModalOpen}
        onClose={closeMarkServiceModal}
        title="Marcar Serviço como Concluído"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={closeMarkServiceModal} disabled={isMarkingService}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleMarkServiceSubmit} isLoading={isMarkingService}>
              {isMarkingService ? 'Marcando...' : 'Marcar Concluído'}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-cinza-neutro mb-4">
          Informe os detalhes do cliente para quem o serviço foi prestado. O cliente precisará confirmar para poder avaliar.
        </p>
        <Input
          label="ID do Cliente*"
          name="markServiceClientId"
          value={markServiceClientId}
          onChange={(e) => setMarkServiceClientId(e.target.value)}
          placeholder="Cole o ID do cliente aqui"
          required
        />
         <Input
          label="Nome do Cliente*"
          name="markServiceClientName"
          value={markServiceClientName}
          onChange={(e) => setMarkServiceClientName(e.target.value)}
          placeholder="Nome completo do cliente"
          required
        />
        <Textarea
          label="Descrição do Serviço (opcional)"
          name="markServiceDescription"
          value={markServiceDescription}
          onChange={(e) => setMarkServiceDescription(e.target.value)}
          placeholder="Ex: Instalação de chuveiro elétrico"
          rows={2}
        />
        {markServiceError && <p className="text-sm text-red-500 mt-2">{markServiceError}</p>}
      </Modal>
    </div>
  );
};

export default ProviderProfilePage;