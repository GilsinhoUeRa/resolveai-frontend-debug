import React, { useState, useEffect, FormEvent } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal'; // Import Modal
import { Specialty } from '@/types';
import { useToast } from '@/hooks/useToast';
import TrashIcon from '@/components/icons/TrashIcon';
import EditIcon from '@/components/icons/EditIcon';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon';
import * as AdminDataService from '@/lib/adminDataService';

const AdminSpecialtiesPage: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [formState, setFormState] = useState<{ name: string }>({ name: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = () => {
    setIsLoading(true);
    const data = AdminDataService.getManagedSpecialties();
    setSpecialties(data.sort((a,b) => a.name.localeCompare(b.name)));
    setIsLoading(false);
  };

  const openModalForCreate = () => {
    setEditingSpecialty(null);
    setFormState({ name: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormState({ name: specialty.name });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpecialty(null);
    setFormState({ name: '' });
    setFormError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formState.name.trim()) {
      setFormError('Nome da especialidade é obrigatório.');
      addToast('Nome da especialidade é obrigatório.', 'error');
      return;
    }

    try {
      if (editingSpecialty) {
        AdminDataService.updateSpecialty({ ...editingSpecialty, ...formState });
        addToast('Especialidade atualizada com sucesso!', 'success');
      } else {
        AdminDataService.addSpecialty(formState);
        addToast('Especialidade adicionada com sucesso!', 'success');
      }
      loadSpecialties();
      closeModal();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao salvar especialidade.';
      addToast(`Erro: ${errorMessage}`, 'error');
      setFormError(errorMessage);
    }
  };

  const handleDelete = (specialtyId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta especialidade? Esta ação não pode ser desfeita.')) {
      try {
        const success = AdminDataService.deleteSpecialty(specialtyId);
        if (success) {
          addToast('Especialidade excluída com sucesso!', 'success');
          loadSpecialties();
        } else {
          addToast('Erro ao excluir especialidade: não encontrada.', 'error');
        }
      } catch (error: any) {
        addToast(`Erro ao excluir especialidade: ${error.message || 'Erro desconhecido'}`, 'error');
      }
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando especialidades...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-grafite-profundo">Gerenciar Especialidades</h1>
        <Button onClick={openModalForCreate} variant="primary">
          <PlusCircleIcon size={20} className="mr-2"/> Adicionar Especialidade
        </Button>
      </div>

      {specialties.length === 0 ? (
        <Card>
            <p className="text-center text-cinza-neutro py-8">Nenhuma especialidade cadastrada. Clique em "Adicionar Especialidade" para começar.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Nome da Especialidade</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-grafite-profundo uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {specialties.map((specialty) => (
                <tr key={specialty.id} className="hover:bg-light-bg/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-grafite-profundo">{specialty.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button onClick={() => openModalForEdit(specialty)} variant="ghost" size="sm" className="!px-2 !py-1 hover:text-orange-energia" title="Editar">
                      <EditIcon size={16} />
                    </Button>
                    <Button onClick={() => handleDelete(specialty.id)} variant="danger" size="sm" className="!px-2 !py-1" title="Excluir">
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
        title={editingSpecialty ? 'Editar Especialidade' : 'Adicionar Nova Especialidade'}
        footer={
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button type="button" form="specialtyForm" onClick={handleSubmit} variant="primary">
              {editingSpecialty ? 'Salvar Alterações' : 'Adicionar Especialidade'}
            </Button>
          </div>
        }
      >
        <form id="specialtyForm" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Especialidade*"
            name="name"
            value={formState.name}
            onChange={handleFormChange}
            required
            autoFocus
          />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
};

export default AdminSpecialtiesPage;