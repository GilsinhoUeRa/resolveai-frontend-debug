// src/pages/admin/AdminProfessionsPage.tsx (Refatorada com TanStack Query)
import React, { useState, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfessionsApi, createProfessionApi, updateProfessionApi, deleteProfessionApi } from '@/services/admin.api';
import { Profession } from '@/types';
import { useToast } from '@/hooks/useToast';

// Os seus componentes de UI
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Modal from '@/components/Modal';
import TrashIcon from '@/components/icons/TrashIcon';
import EditIcon from '@/components/icons/EditIcon';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon';

const AdminProfessionsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
    const [formState, setFormState] = useState<{ name: string; description: string }>({ name: '', description: '' });

    // 1. BUSCA (Query) os dados da API real.
    const { data: professions, isLoading } = useQuery<Profession[]>({
        queryKey: ['admin-professions'],
        queryFn: getProfessionsApi,
    });

    const sortedProfessions = React.useMemo(() => {
        return professions?.sort((a, b) => a.name.localeCompare(b.name)) || [];
    }, [professions]);

    // Função genérica para invalidar o cache e fechar o modal no sucesso
    const onMutationSuccess = (successMessage: string) => {
        addToast(successMessage, 'success');
        queryClient.invalidateQueries({ queryKey: ['admin-professions'] });
        closeModal();
    };

    // 2. MUTAÇÕES para criar, atualizar e eliminar.
    const createMutation = useMutation({
        mutationFn: createProfessionApi,
        onSuccess: () => onMutationSuccess('Profissão criada com sucesso!'),
        onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao criar profissão', 'error'),
    });

    const updateMutation = useMutation({
        mutationFn: updateProfessionApi,
        onSuccess: () => onMutationSuccess('Profissão atualizada com sucesso!'),
        onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao atualizar profissão', 'error'),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProfessionApi,
        onSuccess: () => {
            addToast('Profissão eliminada com sucesso!', 'info');
            queryClient.invalidateQueries({ queryKey: ['admin-professions'] });
        },
        onError: (error: any) => addToast(error.response?.data?.erro || 'Erro ao eliminar profissão', 'error'),
    });

    // Funções para controlar o modal e o formulário
    const openModalForCreate = () => {
        setEditingProfession(null);
        setFormState({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const openModalForEdit = (profession: Profession) => {
        setEditingProfession(profession);
        setFormState({ name: profession.name, description: profession.description });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formState.name.trim() || !formState.description.trim()) {
            addToast('Nome e descrição são obrigatórios.', 'error');
            return;
        }
        if (editingProfession) {
            updateMutation.mutate({ id: editingProfession.id, nome: formState.name, descricao: formState.description });
        } else {
            createMutation.mutate({ nome: formState.name, descricao: formState.description });
        }
    };

    const handleDelete = (profession: Profession) => {
        if (window.confirm(`Tem a certeza que deseja eliminar a profissão "${profession.name}"?`)) {
            deleteMutation.mutate(profession.id);
        }
    };

    if (isLoading) return <div className="text-center py-10">A carregar profissões da API...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-grafite-profundo">Gerir Profissões</h1>
                <Button onClick={openModalForCreate} variant="primary">
                    <PlusCircleIcon size={20} className="mr-2"/> Adicionar Profissão
                </Button>
            </div>

            {sortedProfessions.length === 0 ? (
                <Card>
                    <p className="text-center text-cinza-neutro py-8">Nenhuma profissão registada. Clique em "Adicionar Profissão" para começar.</p>
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
                            {sortedProfessions.map((profession) => (
                                <tr key={profession.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{profession.name}</td>
                                    <td className="px-6 py-4">{profession.description}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button onClick={() => openModalForEdit(profession)} variant="ghost" size="sm"><EditIcon size={16} /></Button>
                                        <Button onClick={() => handleDelete(profession)} variant="danger" size="sm" className="ml-2"><TrashIcon size={16} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProfession ? 'Editar Profissão' : 'Adicionar Nova Profissão'}>
                <form id="professionForm" onSubmit={handleSubmit}>
                    <Input label="Nome da Profissão" name="name" value={formState.name} onChange={handleFormChange} required />
                    <Textarea label="Descrição" name="description" value={formState.description} onChange={handleFormChange} required />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" type="button" onClick={closeModal}>Cancelar</Button>
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                            {editingProfession ? 'Guardar Alterações' : 'Adicionar'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminProfessionsPage;