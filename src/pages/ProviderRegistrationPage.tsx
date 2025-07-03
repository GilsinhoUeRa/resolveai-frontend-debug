// src/pages/ProviderRegistrationPage.tsx (Versão com correção de props)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

// --- IMPORTAÇÕES CORRIGIDAS ---
import { getCategoriesApi } from '@/services/admin.api'; // Busca as categorias/profissões da API de Admin
import { becomeProviderApi } from '@/services/user.api'; // Função para se tornar prestador
import { Category, ProviderProfilePayload } from '@/types'; // Importa os tipos necessários
// --- FIM DAS CORREÇÕES ---

import Button from '@/components/Button';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import Input from '@/components/Input';
import { APP_ROUTES } from '@/constants';

const ProviderRegistrationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  // Estados para controlar os campos do formulário
  const [professionId, setProfessionId] = useState('');
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [workingHours, setWorkingHours] = useState('');

  // Busca as categorias/profissões para preencher o campo de seleção
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories-for-registration'],
    queryFn: getCategoriesApi, // <-- CORRIGIDO: Usa a função de API real
  });

  // Mutação para enviar os dados do formulário
  const { mutate: registerAsProvider, isPending } = useMutation({
    mutationFn: becomeProviderApi,
    onSuccess: () => {
      addToast('Parabéns! Você agora é um prestador.', 'success');
      // Invalida a query 'me' para que o app reconheça a nova role de 'PRESTADOR'
      queryClient.invalidateQueries({ queryKey: ['me'] });
      // Redireciona para o perfil do usuário, que agora será um perfil de prestador
      navigate(APP_ROUTES.USER_PROFILE);
    },
    onError: (error: any) => {
      addToast(error.response?.data?.erro || 'Erro ao atualizar perfil.', 'error');
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!professionId || !bio) {
      addToast('Por favor, selecione uma profissão e preencha a sua biografia.', 'error');
      return;
    }

    const payload: ProviderProfilePayload = {
      profissao_id: parseInt(professionId, 10),
      bio,
      whatsapp,
      horario_atendimento: workingHours,
    };

    registerAsProvider(payload);
  };

  if (user?.role === 'PRESTADOR') {
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold">Você já é um prestador.</h1>
            <Button onClick={() => navigate(APP_ROUTES.USER_PROFILE)} className="mt-4">Ver o Meu Perfil</Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Torne-se um Prestador</h1>
        <p className="text-lg text-cinza-neutro">Complete o seu perfil para começar a oferecer os seus serviços.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <Select
          label="A sua Profissão Principal"
          name="profession"
          value={professionId}
          onChange={(e) => setProfessionId(e.target.value)}
          options={categories?.map(cat => ({ value: cat.id, label: cat.nome })) || []}
          required
          disabled={isLoadingCategories}
          placeholder={isLoadingCategories ? 'Carregando...' : 'Selecione sua profissão'}
        />

        <Textarea
          label="Biografia / Resumo Profissional"
          name="bio"
          rows={5}
          placeholder="Descreva os seus serviços, a sua experiência e o que faz de si um ótimo profissional."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />

        <Input
          label="WhatsApp (Opcional)"
          name="whatsapp"
          type="tel"
          placeholder="(XX) XXXXX-XXXX"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <Input
          label="Horário de Atendimento (Opcional)"
          name="workingHours"
          type="text"
          placeholder="Ex: Seg-Sex, 9h às 18h"
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
        />

        <Button type="submit" isLoading={isPending} fullWidth size="lg">
          {isPending ? 'A finalizar o Registo...' : 'Tornar-se um Prestador'}
        </Button>
      </form>
    </div>
  );
};

export default ProviderRegistrationPage;