
import React, { useState, useEffect, FormEvent } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Modal from '@/components/Modal'; // Import Modal
import { ProfessionCategory } from '@/types';
import { useToast } from '@/hooks/useToast';
import TrashIcon from '@/components/icons/TrashIcon';
import EditIcon from '@/components/icons/EditIcon';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon';
import * as AdminDataService from '@/lib/adminDataService';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ProfessionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProfessionCategory | null>(null);
  const [formState, setFormState] = useState<{ name: string; imageUrl: string; description: string }>({ name: '', imageUrl: '', description: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setIsLoading(true);
    const data = AdminDataService.getManagedCategories();
    setCategories(data.sort((a,b) => a.name.localeCompare(b.name)));
    setIsLoading(false);
  };

  const openModalForCreate = () => {
    setEditingCategory(null);
    setFormState({ name: '', imageUrl: '', description: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (category: ProfessionCategory) => {
    setEditingCategory(category);
    setFormState({ name: category.name, imageUrl: category.imageUrl, description: category.description || '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormState({ name: '', imageUrl: '', description: '' });
    setFormError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formState.name.trim() || !formState.imageUrl.trim()) {
      setFormError('Nome da categoria e URL da imagem são obrigatórios.');
      addToast('Nome da categoria e URL da imagem são obrigatórios.', 'error');
      return;
    }
    try {
      new URL(formState.imageUrl); // Validação simples de URL
    } catch (_) {
      setFormError('URL da imagem inválida.');
      addToast('URL da imagem inválida. Use um formato como https://exemplo.com/imagem.jpg', 'error');
      return;
    }

    try {
      if (editingCategory) {
        AdminDataService.updateCategory({ ...editingCategory, ...formState });
        addToast('Categoria atualizada com sucesso!', 'success');
      } else {
        AdminDataService.addCategory(formState);
        addToast('Categoria adicionada com sucesso!', 'success');
      }
      loadCategories();
      closeModal();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao salvar categoria.';
      addToast(`Erro: ${errorMessage}`, 'error');
      setFormError(errorMessage);
    }
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      try {
        const success = AdminDataService.deleteCategory(categoryId);
        if (success) {
          addToast('Categoria excluída com sucesso!', 'success');
          loadCategories();
        } else {
          addToast('Erro ao excluir categoria: não encontrada.', 'error');
        }
      } catch (error: any) {
        addToast(`Erro ao excluir categoria: ${error.message || 'Erro desconhecido'}`, 'error');
      }
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando categorias de serviço...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-grafite-profundo">Gerenciar Categorias de Serviço</h1>
        <Button onClick={openModalForCreate} variant="primary">
          <PlusCircleIcon size={20} className="mr-2"/> Adicionar Categoria
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
            <p className="text-center text-cinza-neutro py-8">Nenhuma categoria cadastrada. Clique em "Adicionar Categoria" para começar.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Imagem</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-grafite-profundo uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-light-bg/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="w-20 h-12 object-cover rounded-md border border-cinza-neutro/20"
                        onError={(e) => {
                            e.currentTarget.alt = "Imagem inválida";
                            e.currentTarget.src = "https://via.placeholder.com/80x48?text=Erro";
                        }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-grafite-profundo">{category.name}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-cinza-neutro max-w-sm truncate" title={category.description}>{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button onClick={() => openModalForEdit(category)} variant="ghost" size="sm" className="!px-2 !py-1 hover:text-orange-energia" title="Editar">
                      <EditIcon size={16} />
                    </Button>
                    <Button onClick={() => handleDelete(category.id)} variant="danger" size="sm" className="!px-2 !py-1" title="Excluir">
                      <TrashIcon size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
        footer={
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button type="button" form="categoryForm" onClick={handleSubmit} variant="primary">
              {editingCategory ? 'Salvar Alterações' : 'Adicionar Categoria'}
            </Button>
          </div>
        }
      >
        <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Categoria*"
            name="name"
            value={formState.name}
            onChange={handleFormChange}
            required
            autoFocus
          />
          <Input
            label="URL da Imagem*"
            name="imageUrl"
            type="url"
            value={formState.imageUrl}
            onChange={handleFormChange}
            placeholder="https://exemplo.com/imagem.jpg"
            required
          />
          <Textarea
            label="Descrição da Categoria (opcional)"
            name="description"
            value={formState.description}
            onChange={handleFormChange}
            rows={3}
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;