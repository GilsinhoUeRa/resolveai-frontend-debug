// src/pages/ProviderListPage.tsx

import React, { useState, useEffect } from 'react';
// Importamos nossa função e a interface do arquivo api.ts
import { getServicos, Servico } from '@/services/api';

// Seus componentes de UI
import ProviderCardSkeleton from '@/components/skeletons/ProviderCardSkeleton';
// import ProviderCard from '@/components/ProviderCard'; // Vamos usar um card simples por enquanto

const ProviderListPage: React.FC = () => {
  // 1. Vamos usar apenas os 3 estados essenciais por enquanto
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. O useEffect para buscar os dados, exatamente como no nosso exemplo original
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        setIsLoading(true);
        // Por enquanto, chamamos a função sem nenhum filtro para trazer tudo
        const data = await getServicos();
        setServicos(data);
      } catch (err) {
        setError("Falha ao carregar os dados. Verifique sua conexão ou tente mais tarde.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicos();
  }, []); // Array vazio para rodar apenas uma vez

  // 3. Lógica de renderização para os estados de carregando e erro
  if (isLoading) {
    // Mostra os "skeletons" enquanto os dados carregam
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {[1, 2, 3].map(i => <ProviderCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8" style={{ color: 'red' }}>{error}</div>;
  }

  // 4. Se tudo deu certo, mostra a lista de serviços
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-grafite-profundo">Encontre Prestadores de Serviço</h1>
        <p className="text-lg text-cinza-neutro">Explore os serviços disponíveis na nossa plataforma.</p>
      </header>

      {/* Vamos ignorar a barra de filtros por enquanto */}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {servicos.length > 0 ? (
          servicos.map(servico => (
            // Usando um card simples para teste. Adapte para seu ProviderCard depois.
            <div key={servico.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <h3>{servico.nome}</h3>
              <p><strong>Prestador:</strong> {servico.nome_prestador}</p>
              <p><strong>Preço:</strong> R$ {servico.preco}</p>
              <p><strong>Nota:</strong> {Number(servico.nota_media).toFixed(1)} ({servico.total_avaliacoes} avaliações)</p>
            </div>
          ))
        ) : (
          <p>Nenhum serviço encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderListPage;