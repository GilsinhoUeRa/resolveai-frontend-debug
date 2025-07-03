// src/pages/admin/AdminSpecialtiesPage.tsx (Refatorada com TanStack Query)
import React, { useState, FormEvent, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialtiesApi, createSpecialtyApi, updateSpecialtyApi, deleteSpecialtyApi } from '@/services/admin.api';
import { Specialty } from '@/types';
import { useToast } from '@/hooks/useToast';

// Os seus componentes de UI
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import TrashIcon from '@/components/icons/TrashIcon';
import EditIcon from '@/components/icons/EditIcon';
import PlusCircleIcon from '@/components/icons/PlusCircleIcon';

const AdminSpecialtiesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
    const [formState, setFormState] = useState<{ name: string }>({ name: '' });

    const { data: specialties, isLoading } = useQuery<Specialty[]>({
        queryKey: ['admin-specialties'],
        queryFn: getSpecialtiesApi,
    });

    const sortedSpecialties = useMemo(() => {
        return specialties?.sort((a, b) => a.name.localeCompare(b.name)) || [];
    }, [specialties]);

    const onMutationSuccess = (message: string) => {
        addToast(message, 'success');
        queryClient.invalidateQueries({ queryKey: ['admin-specialties'] });
        closeModal();
    };

    const createMutation = useMutation({
        mutationFn: createSpecialtyApi,
        onSuccess: () => onMutationSuccess('Especialidade criada com sucesso!'),
        onError: (err: any) => addToast(err.response?.data?.erro || 'Erro ao criar.', 'error'),
    });

    const updateMutation = useMutation({
        mutationFn: updateSpecialtyApi,
        onSuccess: () => onMutationSuccess('Especialidade atualizada com sucesso!'),
        onError: (err: any) => addToast(err.response?.data?.erro || 'Erro ao atualizar.', 'error'),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSpecialtyApi,
        onSuccess: () => {
            addToast('Especialidade eliminada com sucesso.', 'info');
            queryClient.invalidateQueries({ queryKey: ['admin-specialties'] });
        },
        onError: (err: any) => addToast(err.response?.data?.erro || 'Erro ao eliminar.', 'error'),
    });

    const openModalForCreate = () => {
        setEditingSpecialty(null);
        setFormState({ name: '' });
        setIsModalOpen(true);
    };

    const openModalForEdit = (specialty: Specialty) => {
        setEditingSpecialty(specialty);
        setFormState({ name: specialty.name });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ name: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formState.name.trim()) {
            addToast('O nome da especialidade é obrigatório.', 'error');
            return;
        }
        if (editingSpecialty) {
            updateMutation.mutate({ id: editingSpecialty.id, nome: formState.name });
        } else {
            createMutation.mutate(formState.name);
        }
    };

    const handleDelete = (specialty: Specialty) => {
        if (window.confirm(`Tem a certeza que deseja eliminar a especialidade "${specialty.name}"?`)) {
            deleteMutation.mutate(specialty.id);
        }
    };

    if (isLoading) return <div className="text-center py-10">A carregar especialidades da API...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-grafite-profundo">Gerir Especialidades</h1>
                <Button onClick={openModalForCreate} variant="primary">
                    <PlusCircleIcon size={20} className="mr-2"/> Adicionar Especialidade
                </Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="min-w-full">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Nome da Especialidade</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-grafite-profundo uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedSpecialties.map((specialty) => (
                            <tr key={specialty.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{specialty.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button onClick={() => openModalForEdit(specialty)} variant="ghost" size="sm" className="!px-2 !py-1"><EditIcon size={16} /></Button>
                                    <Button onClick={() => handleDelete(specialty)} variant="danger" size="sm" className="ml-2 !px-2 !py-1"><TrashIcon size={16} /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSpecialty ? 'Editar Especialidade' : 'Adicionar Nova Especialidade'}>
                <form id="specialtyForm" onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome da Especialidade" name="name" value={formState.name} onChange={handleFormChange} required autoFocus />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" type="button" onClick={closeModal}>Cancelar</Button>
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                            {editingSpecialty ? 'Guardar Alterações' : 'Adicionar'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminSpecialtiesPage;