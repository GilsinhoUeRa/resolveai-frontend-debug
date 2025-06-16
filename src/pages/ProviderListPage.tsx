// src/pages/ProviderListPage.tsx (Refatorado com useQuery)

import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 1. Importamos nossa nova função de API
import { getServices } from '@/services/api';

// Seus componentes de UI
import ProviderCard from '@/components/ProviderCard';
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton';

const ProviderListPage: React.FC = () => {

  // 2. Substituímos useState e useEffect por uma única chamada ao useQuery.
  // Ele gerencia o loading, erros e os dados para nós.
  const { 
    data: services, // renomeamos 'data' para 'services' para clareza
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['services'], // Chave única para esta busca de dados
    queryFn: getServices,  // A função que será executada para buscar os dados
  });

  // 3. Renderizamos o esqueleto de carregamento
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <ProviderCardSkeleton key={i} />)}
      </div>
    );
  }

  // 4. Renderizamos uma mensagem de erro se a busca falhar
  if (isError) {
    return <p className="text-red-500">Erro ao buscar prestadores: {error.message}</p>;
  }

  // 5. Renderizamos os dados quando a busca for bem-sucedida
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-grafite-profundo">Encontre o Profissional Ideal</h1>

      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6"> {/* Ajustado para 1 coluna */}
          {services.map(service => (
            <ProviderCard key={service.id} provider={service} />
          ))}
        </div>
      ) : (
        <p>Nenhum prestador de serviço encontrado no momento.</p>
      )}
    </div>
  );
};

export default ProviderListPage;