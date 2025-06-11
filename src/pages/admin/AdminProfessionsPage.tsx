import React, { useState, useEffect, FormEvent } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Modal from '@/components/Modal'; // Import Modal
import { Profession } from '@/types';
import { useToast } from '@/hooks/useToast';
import TrashIcon from '@/components/icons/TrashIcon';
import EditIcon from '@/components/icons/EditIcon';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon';
import * as AdminDataService from '@/lib/adminDataService';

const AdminProfessionsPage: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
  const [formState, setFormState] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    loadProfessions();
  }, []);

  const loadProfessions = () => {
    setIsLoading(true);
    const data = AdminDataService.getManagedProfessions();
    setProfessions(data.sort((a,b) => a.name.localeCompare(b.name)));
    setIsLoading(false);
  };

  const openModalForCreate = () => {
    setEditingProfession(null);
    setFormState({ name: '', description: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (profession: Profession) => {
    setEditingProfession(profession);
    setFormState({ name: profession.name, description: profession.description });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfession(null); // Limpa o estado de edição
    setFormState({ name: '', description: '' }); // Reseta o formulário
    setFormError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formState.name.trim() || !formState.description.trim()) {
      setFormError('Nome e descrição são obrigatórios.');
      addToast('Nome e descrição são obrigatórios.', 'error');
      return;
    }

    try {
      if (editingProfession) {
        AdminDataService.updateProfession({ ...editingProfession, ...formState });
        addToast('Profissão atualizada com sucesso!', 'success');
      } else {
        AdminDataService.addProfession(formState);
        addToast('Profissão adicionada com sucesso!', 'success');
      }
      loadProfessions();
      closeModal();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao salvar profissão.';
      addToast(`Erro: ${errorMessage}`, 'error');
      setFormError(errorMessage);
    }
  };

  const handleDelete = (professionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta profissão? Esta ação não pode ser desfeita.')) {
      try {
        const success = AdminDataService.deleteProfession(professionId);
        if (success) {
          addToast('Profissão excluída com sucesso!', 'success');
          loadProfessions();
        } else {
          addToast('Erro ao excluir profissão: não encontrada.', 'error');
        }
      } catch (error: any) {
        addToast(`Erro ao excluir profissão: ${error.message || 'Erro desconhecido'}`, 'error');
      }
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando profissões...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-grafite-profundo">Gerenciar Profissões</h1>
        <Button onClick={openModalForCreate} variant="primary">
          <PlusCircleIcon size={20} className="mr-2"/> Adicionar Profissão
        </Button>
      </div>

      {professions.length === 0 ? (
        <Card>
            <p className="text-center text-cinza-neutro py-8">Nenhuma profissão cadastrada. Clique em "Adicionar Profissão" para começar.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-grafite-profundo uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professions.map((profession) => (
                <tr key={profession.id} className="hover:bg-light-bg/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-grafite-profundo">{profession.name}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-cinza-neutro max-w-md truncate" title={profession.description}>{profession.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button onClick={() => openModalForEdit(profession)} variant="ghost" size="sm" className="!px-2 !py-1 hover:text-orange-energia" title="Editar">
                      <EditIcon size={16} />
                    </Button>
                    <Button onClick={() => handleDelete(profession.id)} variant="danger" size="sm" className="!px-2 !py-1" title="Excluir">
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
        title={editingProfession ? 'Editar Profissão' : 'Adicionar Nova Profissão'}
        footer={
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button type="button" form="professionForm" onClick={handleSubmit} variant="primary">
              {editingProfession ? 'Salvar Alterações' : 'Adicionar Profissão'}
            </Button>
          </div>
        }
      >
        <form id="professionForm" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Profissão*"
            name="name"
            value={formState.name}
            onChange={handleFormChange}
            required
            autoFocus
          />
          <Textarea
            label="Descrição da Profissão*"
            name="description"
            value={formState.description}
            onChange={handleFormChange}
            rows={4}
            required
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
};

export default AdminProfessionsPage;