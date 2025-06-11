import React, { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { COLORS } from '@/constants';
import { SubscriptionPlan, SubscriptionCycle } from '@/types'; 
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';

interface PlanDetails {
  id: Exclude<SubscriptionPlan, 'trial' | 'free'>;
  name: string;
  priceMonthly: number;
  features: string[];
  highlight?: boolean;
  discounts: {
    quarterly: number;
    semi_annually: number;
    annually: number;
  };
}

interface PricingCardProps {
  plan: PlanDetails;
  onSubscribe: (planId: Exclude<SubscriptionPlan, 'trial' | 'free'>, cycle: SubscriptionCycle) => void;
  isSubscribing: boolean;
  currentPlanId?: SubscriptionPlan;
  isUserProvider?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSubscribe, isSubscribing, currentPlanId, isUserProvider }) => {
  const [selectedCycle, setSelectedCycle] = useState<SubscriptionCycle>('monthly');

  const cycleOptions: { id: SubscriptionCycle; label: string; months: number; discount: number }[] = [
    { id: 'monthly', label: 'Mensal', months: 1, discount: 0 },
    { id: 'quarterly', label: 'Trimestral', months: 3, discount: plan.discounts.quarterly },
    { id: 'semi_annually', label: 'Semestral', months: 6, discount: plan.discounts.semi_annually },
    { id: 'annually', label: 'Anual', months: 12, discount: plan.discounts.annually },
  ];

  const calculatePrice = (basePrice: number, months: number, discount: number) => {
    const totalPrice = basePrice * months;
    const discountedPrice = totalPrice * (1 - discount);
    return {
      total: discountedPrice,
      perMonth: discountedPrice / months,
      saved: totalPrice - discountedPrice,
    };
  };

  const currentCyclePrice = calculatePrice(plan.priceMonthly, cycleOptions.find(c => c.id === selectedCycle)!.months, cycleOptions.find(c => c.id === selectedCycle)!.discount);
  const isCurrentSubscribedPlan = currentPlanId === plan.id;

  return (
    <Card className={`flex flex-col ${plan.highlight ? 'border-2 border-orange-energia shadow-orange-energia/30' : 'border border-cinza-neutro/30'} rounded-xl overflow-hidden h-full`}>
      {plan.highlight && (
        <div className="bg-orange-energia text-white text-center py-2 text-sm font-semibold">
          Mais Popular
        </div>
      )}
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-grafite-profundo text-center mb-2">{plan.name}</h3>
        
        <div className="text-center mb-6">
          <span className="text-4xl font-extrabold text-orange-energia">
            R$ {currentCyclePrice.perMonth.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-md text-cinza-neutro">/mês</span>
          {selectedCycle !== 'monthly' && (
            <p className="text-xs text-cinza-neutro">
              Total: R$ {currentCyclePrice.total.toFixed(2).replace('.', ',')} (economize R$ {currentCyclePrice.saved.toFixed(2).replace('.', ',')})
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor={`cycle-${plan.id}`} className="block text-sm font-medium text-grafite-profundo mb-1">Ciclo de Pagamento:</label>
          <select 
            id={`cycle-${plan.id}`} 
            value={selectedCycle} 
            onChange={(e) => setSelectedCycle(e.target.value as SubscriptionCycle)}
            className="w-full px-3 py-2 border border-cinza-neutro rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-energia sm:text-sm bg-white"
            disabled={isSubscribing || isCurrentSubscribedPlan}
          >
            {cycleOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label} {opt.discount > 0 && `(${Math.round(opt.discount * 100)}% OFF)`}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-2 mb-8 text-sm text-grafite-profundo flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 mt-auto bg-light-bg/50">
        {isUserProvider && (
          <Button
            variant={plan.highlight ? 'primary' : 'secondary'}
            fullWidth
            onClick={() => onSubscribe(plan.id, selectedCycle)}
            isLoading={isSubscribing && !isCurrentSubscribedPlan} // Mostra loading apenas se estiver processando este plano
            disabled={isSubscribing || isCurrentSubscribedPlan}
          >
            {isCurrentSubscribedPlan ? 'Plano Atual' : `Assinar Plano ${plan.name}`}
          </Button>
        )}
         {!isUserProvider && (
             <Button
                variant="primary"
                fullWidth
                disabled={true}
            >
                Disponível para Prestadores
            </Button>
         )}
      </div>
    </Card>
  );
};

export default PricingCard;