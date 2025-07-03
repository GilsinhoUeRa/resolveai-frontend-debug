// src/pages/ProviderListPage.tsx (Refatorado com useQuery)

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServicosApi } from '@/services/services.api';
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton';
import ProviderCard from '@/components/ProviderCard'; // Importe seu componente de card

const ProviderListPage: React.FC = () => {
  // 1. O hook useQuery substitui useState, useEffect e a chamada manual da API.
  const { 
    data: servicos, 
    isLoading, 
    isError, 
    error 
  } = useQuery<Servico[], Error>({
    queryKey: ['servicos'], // Uma chave única para esta busca de dados
    queryFn: getServicosApi,   // A função que realmente busca os dados (deve retornar uma promessa)
  });

  // 2. O componente reage aos estados fornecidos pelo hook.
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Buscando Prestadores...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <ProviderCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600">Ocorreu um erro ao buscar os dados.</h2>
        <p className="text-cinza-neutro">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Encontre Prestadores de Serviço</h1>
        <p className="text-lg text-cinza-neutro">Os melhores profissionais para resolver o que você precisa.</p>
      </header>

      {servicos && servicos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Supondo que você queira exibir os prestadores (usuários) e não os serviços */}
          {/* Se 'getServicosApi' retorna prestadores, o código abaixo funciona. */}
          {/* Se retorna serviços, você precisará adaptar para mostrar o card do serviço. */}
          {/* Vou assumir que são prestadores para o exemplo do ProviderCard */}
          {/* {servicos.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))} */}

          {/* Se 'getServicos' retorna a lista de serviços: */}
           {servicos.map(servico => (
            <div key={servico.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold text-lg">{servico.nome}</h3>
              <p className="text-sm text-cinza-neutro">{servico.descricao}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-10">Nenhum serviço ou prestador encontrado.</p>
      )}
    </div>
  );
};

export default ProviderListPage;