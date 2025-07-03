// src/pages/admin/AdminCategoriesPage.tsx (Refatorada)
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@/services/admin.api';
import { Category } from '@/types';
import { useToast } from '@/hooks/useToast';
// Importe seus componentes de UI (Button, Input, etc.)

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: getCategoriesApi,
  });

  const createMutation = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: () => {
      addToast('Categoria criada com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setNewCategoryName('');
    },
    onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao criar categoria', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: () => {
      addToast('Categoria atualizada com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao atualizar categoria', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      addToast('Categoria deletada com sucesso!', 'info');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao deletar categoria', 'error'),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      createMutation.mutate(newCategoryName.trim());
    }
  };

  const handleUpdate = (category: Category) => {
    const newName = prompt('Novo nome para a categoria:', category.nome);
    if (newName && newName.trim() !== category.nome) {
      updateMutation.mutate({ id: category.id, nome: newName.trim() });
    }
  };

  const handleDelete = (category: Category) => {
    if (window.confirm(`Tem certeza que deseja deletar a categoria "${category.nome}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  if (isLoading) return <p>Carregando categorias da API...</p>;

  // O resto do seu JSX para exibir o formulário e a tabela permanece similar,
  // mas os handlers de clique agora chamarão handleUpdate e handleDelete.
  // Exemplo para o botão de deletar:
  // <button onClick={() => handleDelete(category)} disabled={deleteMutation.isPending}>Deletar</button>

  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias (API Real)</h1>
        {/* ... Seu JSX para formulário e tabela ... */}
    </div>
  );
};

export default AdminCategoriesPage;