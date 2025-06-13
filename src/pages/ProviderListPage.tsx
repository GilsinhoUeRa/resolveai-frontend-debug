// src/pages/ProviderListPage.tsx

import React from 'react';
// 1. Importamos o hook 'useQuery' do TanStack
import { useQuery } from '@tanstack/react-query';

// Nossas ferramentas de API e tipos continuam os mesmos
import { getServicos, Servico } from '@/services/api'; 
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton';

const ProviderListPage: React.FC = () => {
  
  // 2. AQUI ESTÁ A MÁGICA:
  // Tudo é substituído por este único hook.
  const { 
    data: servicos, // O hook retorna 'data', que renomeamos para 'servicos' para clareza
    isLoading,      // um booleano que nos diz se a busca está em andamento
    isError,        // um booleano que nos diz se houve um erro
    error           // o objeto de erro em si, para podermos ver o detalhe
  } = useQuery<Servico[], Error>({
    // A 'queryKey' é a identidade desta busca de dados.
    // É como um ID que o TanStack usa para o cache.
    queryKey: ['servicos'], 
    
    // A 'queryFn' é a função que busca os dados.
    // Ela DEVE retornar uma Promise (funções async fazem isso automaticamente).
    queryFn: getServicos, 
  });

  // 3. O resto do seu componente continua igual, mas agora muito mais limpo e poderoso.
  // A lógica de `if (isLoading)` e `if (isError)` funciona da mesma forma.
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Carregando Prestadores...</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
          {[1, 2, 3].map(i => <ProviderCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Erro capturado pelo TanStack Query:", error);
    return <div className="container mx-auto px-4 py-8 text-red-500"><h1>Erro na Comunicação</h1><p>{error.message}</p></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-grafite-profundo">Encontre Prestadores de Serviço</h1>
        <p className="text-lg text-cinza-neutro">Explore os serviços disponíveis em nossa plataforma.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {servicos && servicos.length > 0 ? ( // Verificação extra para garantir que 'servicos' não é undefined
          servicos.map(servico => (
            <div key={servico.id} className="p-6 bg-white border rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-orange-energia">{servico.nome}</h3>
              <p><strong>Prestador:</strong> {servico.nome_prestador}</p>
              <p><strong>Preço:</strong> R$ {servico.preco}</p>
              <p><strong>Nota:</strong> {Number(servico.nota_media).toFixed(1)} ({servico.total_avaliacoes} avaliações)</p>
            </div>
          ))
        ) : (
          <p className="p-6 bg-white border rounded-lg shadow-md text-center text-cinza-neutro">Nenhum serviço encontrado no momento.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderListPage;