import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '@/components/PricingCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { PRICING_PLANS_DETAILS, APP_ROUTES } from '@/constants';
import { SubscriptionPlan, SubscriptionCycle, UserType, ProviderDetails } from '@/types';
import Button from '@/components/Button';
import Card from '@/components/Card';

const PricingPlansPage: React.FC = () => {
  const { user, subscribeToPlan, loading: authLoading, checkAndUpdateSubscriptionStatus } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Garante que o status da assinatura esteja atualizado ao carregar a página
    if (user && user.userType === UserType.PROVIDER) {
      checkAndUpdateSubscriptionStatus();
    }
  }, [user, checkAndUpdateSubscriptionStatus]);

  const handleSubscribe = async (planId: Exclude<SubscriptionPlan, 'trial' | 'free'>, cycle: SubscriptionCycle) => {
    if (!user || user.userType !== UserType.PROVIDER) {
      addToast('Apenas prestadores de serviço podem assinar planos.', 'error');
      navigate(APP_ROUTES.LOGIN, { state: { from: location.pathname }});
      return;
    }
    setIsSubscribing(true);
    try {
      await subscribeToPlan(planId, cycle);
      addToast(`Você assinou o plano ${PRICING_PLANS_DETAILS.find(p=>p.id === planId)?.name} (${cycle}) com sucesso! (Simulado)`, 'success');
      navigate(APP_ROUTES.USER_PROFILE); // Redireciona para o perfil para ver o status atualizado
    } catch (error: any) {
      addToast(error.message || 'Erro ao processar assinatura.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentProviderPlan = user && user.userType === UserType.PROVIDER ? (user as ProviderDetails).subscriptionPlan : undefined;
  const currentProviderCycle = user && user.userType === UserType.PROVIDER ? (user as ProviderDetails).subscriptionCycle : undefined;
  const currentSubscriptionEndsAt = user && user.userType === UserType.PROVIDER ? (user as ProviderDetails).subscriptionEndsAt : undefined;

  if (authLoading) {
    return <div className="text-center py-10">Carregando planos...</div>;
  }
  
  if (user && user.userType !== UserType.PROVIDER) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-grafite-profundo mb-4">Planos de Assinatura</h1>
            <p className="text-cinza-neutro mb-6">Os planos de assinatura são exclusivos para prestadores de serviço.</p>
            <Button onClick={() => navigate(APP_ROUTES.HOME)}>Voltar para Início</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-grafite-profundo mb-3">Nossos Planos para Prestadores</h1>
        <p className="text-xl text-cinza-neutro max-w-2xl mx-auto">
          Escolha o plano ideal para destacar seus serviços, alcançar mais clientes e gerenciar seu perfil com ferramentas exclusivas.
        </p>
      </header>

      {currentProviderPlan && currentProviderPlan !== 'free' && currentProviderPlan !== 'trial' && (
        <Card className="mb-10 p-6 bg-green-50 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-700">Você já possui uma assinatura ativa!</h2>
          <p className="text-green-600 mt-1">
            Plano atual: <span className="font-bold">{PRICING_PLANS_DETAILS.find(p=>p.id === currentProviderPlan)?.name || currentProviderPlan}</span>
            {currentProviderCycle && ` (${currentProviderCycle})`}.
            {currentSubscriptionEndsAt && ` Válida até: ${new Date(currentSubscriptionEndsAt).toLocaleDateString('pt-BR')}.`}
          </p>
          <p className="text-sm text-green-600 mt-2">
            Para alterar seu plano, por favor, entre em contato com o suporte (simulado).
          </p>
        </Card>
      )}
      
       {currentProviderPlan === 'trial' && (user as ProviderDetails).trialEndsAt && (
        <Card className="mb-10 p-6 bg-blue-50 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-700">Você está em Período de Teste!</h2>
          <p className="text-blue-600 mt-1">
            Aproveite todas as funcionalidades Premium até {new Date((user as ProviderDetails).trialEndsAt!).toLocaleDateString('pt-BR')}.
          </p>
           <p className="text-sm text-blue-600 mt-2">
            Escolha um plano abaixo para continuar com os benefícios após o término do teste.
          </p>
        </Card>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS_DETAILS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSubscribe={handleSubscribe}
            isSubscribing={isSubscribing}
            currentPlanId={currentProviderPlan}
            isUserProvider={user?.userType === UserType.PROVIDER}
          />
        ))}
      </div>

      <section className="mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-grafite-profundo mb-4">Perguntas Frequentes (Simulado)</h2>
        <div className="text-left space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <h3 className="font-semibold text-orange-energia">Posso cancelar a qualquer momento?</h3>
            <p className="text-sm text-cinza-neutro">Sim, você pode gerenciar sua assinatura no seu perfil.</p>
          </div>
          <div>
            <h3 className="font-semibold text-orange-energia">Como funcionam os descontos anuais?</h3>
            <p className="text-sm text-cinza-neutro">Ao optar pelo ciclo anual, você recebe um desconto significativo no valor total.</p>
          </div>
           <div>
            <h3 className="font-semibold text-orange-energia">O que acontece após o período de teste?</h3>
            <p className="text-sm text-cinza-neutro">Se não escolher um plano pago, seu perfil será movido para o plano gratuito com funcionalidades limitadas.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPlansPage;