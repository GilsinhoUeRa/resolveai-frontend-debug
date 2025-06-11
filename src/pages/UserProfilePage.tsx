import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast'; 
import { User, UserType, ProviderDetails, SubscriptionPlan, SubscriptionCycle, CompletedServiceRecord } from '@/types';
import { APP_ROUTES, PRICING_PLANS_DETAILS } from '@/constants';
import Card from '@/components/Card'; // Import Card

const UserProfilePage: React.FC = () => {
  const { 
    user, updateUser, logout, loading: authLoading, 
    completedServices, confirmServiceCompletionByClient, allUsers 
  } = useAuth();
  const { addToast } = useToast(); 
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    city: '',
    photoUrl: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingService, setIsConfirmingService] = useState<string | null>(null); // recordId
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Serviços pendentes de confirmação pelo cliente
  const [pendingConfirmationServices, setPendingConfirmationServices] = useState<CompletedServiceRecord[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        city: user.city || '',
        photoUrl: user.photoUrl || '',
      });
      setPhotoPreview(user.photoUrl || null);

      if (user.userType === UserType.CLIENT) {
        const pending = completedServices.filter(
          record => record.clientId === user.id && !record.canClientReview && !record.dateConfirmedByClient
        ).map(record => {
          // Tenta obter o nome do prestador de `allUsers` (se disponível e necessário)
          // Em um sistema real, o backend já retornaria isso.
          const providerInfo = allUsers.find(u => u.id === record.providerId);
          return {
            ...record,
            providerName: providerInfo?.name || record.providerName || 'Prestador Desconhecido'
          };
        }).sort((a,b) => new Date(b.dateMarkedCompletedByProvider).getTime() - new Date(a.dateMarkedCompletedByProvider).getTime());
        setPendingConfirmationServices(pending);
      }

    } else {
      navigate(APP_ROUTES.LOGIN);
    }
  }, [user, navigate, completedServices, allUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!user) {
        addToast('Usuário não encontrado. Por favor, faça login novamente.', 'error');
        navigate(APP_ROUTES.LOGIN);
        return;
    }

    if (!formData.name || !formData.email) {
      setValidationError('Nome e e-mail são obrigatórios.');
      addToast('Nome e e-mail são obrigatórios.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateUser({ 
        id: user.id, 
        ...formData, 
        photoFile: photoFile, 
        photoUrl: photoPreview || formData.photoUrl 
      });
      addToast('Perfil atualizado com sucesso!', 'success');
      setIsEditing(false);
      setPhotoFile(null); 
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao atualizar o perfil.';
      setValidationError(errorMsg);
      addToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValidationError(null);
    if (user) { 
        setFormData({
            name: user.name,
            email: user.email,
            city: user.city || '',
            photoUrl: user.photoUrl || '',
        });
        setPhotoPreview(user.photoUrl || null);
    }
    setPhotoFile(null);
  };

  const handleLogout = () => {
    logout();
    addToast('Você saiu da sua conta.', 'info');
    navigate(APP_ROUTES.WELCOME);
  };

  const handleConfirmService = async (recordId: string) => {
    setIsConfirmingService(recordId);
    try {
        await confirmServiceCompletionByClient(recordId);
        // O useEffect atualizará a lista `pendingConfirmationServices`
    } catch (error: any) {
        addToast(error.message || 'Erro ao confirmar serviço.', 'error');
    } finally {
        setIsConfirmingService(null);
    }
  };

  const formatPlanName = (plan?: SubscriptionPlan) => {
    if (!plan) return 'Nenhum';
    const planDetail = PRICING_PLANS_DETAILS.find(p => p.id === plan);
    if (plan === 'trial') return 'Período de Teste';
    if (plan === 'free') return 'Gratuito (Expirado/Básico)';
    return planDetail?.name || plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const formatCycleName = (cycle?: SubscriptionCycle) => {
    if (!cycle) return '';
    const names = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      semi_annually: 'Semestral',
      annually: 'Anual',
    };
    return names[cycle] || '';
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };


  if (authLoading && !user) {
    return <div className="text-center py-10">Carregando perfil...</div>;
  }

  if (!user) {
    return null; 
  }
  
  const placeholderAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=f57c00&color=fff&size=128`;
  const providerDetails = user.userType === UserType.PROVIDER ? (user as ProviderDetails) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <header className="text-center mb-10">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={photoPreview || placeholderAvatar}
              alt="Foto do Perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-energia shadow-md"
              onError={(e) => (e.currentTarget.src = placeholderAvatar)}
            />
            {isEditing && (
              <label htmlFor="photoUpload" className="absolute bottom-0 right-0 bg-grafite-profundo text-white p-2 rounded-full cursor-pointer hover:bg-opacity-80 transition-colors" title="Alterar foto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                <input type="file" id="photoUpload" name="photoUrl" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
          <h1 className="text-3xl font-bold text-grafite-profundo">Meu Perfil</h1>
          <p className="text-lg text-cinza-neutro">{user.userType === UserType.PROVIDER ? 'Prestador de Serviço' : 'Cliente'}</p>
        </header>

        {validationError && (
            <p className="mb-4 text-sm text-red-600 text-center p-3 bg-red-100 rounded-md">{validationError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome Completo"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            disabled={!isEditing || authLoading || isSubmitting}
            required
            error={validationError && !formData.name ? "Nome é obrigatório" : undefined}
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled // Email usually not editable or requires verification
            required
            error={validationError && !formData.email ? "E-mail é obrigatório" : undefined}
          />
          <Input
            label="Cidade"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            disabled={!isEditing || authLoading || isSubmitting}
          />

          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button type="submit" isLoading={isSubmitting || authLoading} fullWidth variant="primary">
                Salvar Alterações
              </Button>
              <Button type="button" onClick={handleCancelEdit} fullWidth variant="ghost" disabled={isSubmitting || authLoading}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)} fullWidth variant="secondary">
              Editar Perfil
            </Button>
          )}
        </form>

        {/* Seção para Cliente Confirmar Serviços */}
        {user.userType === UserType.CLIENT && pendingConfirmationServices.length > 0 && (
            <div className="mt-8 pt-6 border-t border-cinza-neutro/20">
                <h2 className="text-xl font-semibold text-grafite-profundo mb-4">Serviços Aguardando Sua Confirmação</h2>
                <div className="space-y-4">
                    {pendingConfirmationServices.map(record => (
                        <Card key={record.recordId} className="p-4 bg-light-bg border border-orange-energia/30">
                            <p className="text-sm font-medium text-grafite-profundo">
                                Prestador: <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${record.providerId}`} className="text-orange-energia hover:underline">{record.providerName}</Link>
                            </p>
                            {record.serviceDescription && <p className="text-xs text-cinza-neutro mt-1">Serviço: {record.serviceDescription}</p>}
                            <p className="text-xs text-cinza-neutro mt-1">Marcado como concluído em: {formatDate(record.dateMarkedCompletedByProvider)}</p>
                            <Button 
                                onClick={() => handleConfirmService(record.recordId)} 
                                variant="primary" 
                                size="sm" 
                                className="mt-3"
                                isLoading={isConfirmingService === record.recordId}
                            >
                                {isConfirmingService === record.recordId ? 'Confirmando...' : 'Confirmar Conclusão e Liberar Avaliação'}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        )}


        {providerDetails && (
          <div className="mt-8 pt-6 border-t border-cinza-neutro/20">
            <h2 className="text-xl font-semibold text-grafite-profundo mb-3">Gerenciar Perfil de Prestador</h2>
            <div className="mb-4 p-4 bg-light-bg rounded-md">
              <h3 className="text-md font-semibold text-grafite-profundo">Plano Atual: <span className="text-orange-energia">{formatPlanName(providerDetails.subscriptionPlan)}</span></h3>
              {providerDetails.subscriptionPlan === 'trial' && providerDetails.trialEndsAt && (
                <p className="text-sm text-cinza-neutro">Seu período de teste termina em: {formatDate(providerDetails.trialEndsAt)}</p>
              )}
              {providerDetails.subscriptionPlan !== 'trial' && providerDetails.subscriptionPlan !== 'free' && providerDetails.subscriptionEndsAt && (
                 <p className="text-sm text-cinza-neutro">
                    Ciclo: {formatCycleName(providerDetails.subscriptionCycle)}. Sua assinatura expira em: {formatDate(providerDetails.subscriptionEndsAt)}
                 </p>
              )}
               {(providerDetails.subscriptionPlan === 'free' || (!providerDetails.subscriptionPlan && providerDetails.userType === UserType.PROVIDER)) && (
                  <p className="text-sm text-cinza-neutro">Você está no plano gratuito. Considere um upgrade para mais funcionalidades.</p>
              )}
            </div>
            <Link to={APP_ROUTES.PRICING_PLANS} className="block mb-3">
              <Button variant="primary" fullWidth>
                {providerDetails.subscriptionPlan === 'trial' || providerDetails.subscriptionPlan === 'free' ? 'Ver Planos de Assinatura' : 'Gerenciar Assinatura'}
              </Button>
            </Link>
            <Link to={APP_ROUTES.PROVIDER_REGISTER} className="block mb-3">
              <Button variant="secondary" fullWidth>
                Editar Detalhes de Prestador
              </Button>
            </Link>
             <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${user.id}`} className="block">
              <Button variant="ghost" fullWidth>
                Ver Meu Perfil Público
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-cinza-neutro/20 text-center">
          <Button onClick={handleLogout} variant="danger" size="sm">
            Sair da Conta (Logout)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;