// src/pages/admin/AdminUsersPage.tsx (Versão Final com useQuery e useMutation)
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

// API real para buscar e atualizar utilizadores
import { getUsersApi, updateUserStatusApi } from '@/services/admin.api';

// Tipos e Componentes
import { User, ProviderDetails, UserType } from '@/types';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useToast } from '@/hooks/useToast';
import { BanIcon } from '@/components/icons/BanIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { APP_ROUTES } from '@/constants';

const AdminUsersPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. A PÁGINA AGORA BUSCA OS SEUS PRÓPRIOS DADOS, INDEPENDENTEMENTE DO useAuth
    const { data: allUsers = [], isLoading, isError } = useQuery<(User | ProviderDetails)[]>({
        queryKey: ['admin-users'],
        queryFn: getUsersApi,
    });

    // 2. A lógica de filtro permanece, mas agora reage a 'allUsers' do useQuery
    const queryParams = new URLSearchParams(location.search);
    const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>(queryParams.get('status') as any || 'all');
    const [typeFilter, setTypeFilter] = useState<'all' | UserType.CLIENT | UserType.PROVIDER>(queryParams.get('type') as any || 'all');

    const filteredUsers = useMemo(() => {
        const processedUsers = allUsers.map(u => ({ ...u, isActive: u.isActive !== false }));
        let tempUsers = [...processedUsers];

        if (searchTerm) {
            tempUsers = tempUsers.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            tempUsers = tempUsers.filter(user => statusFilter === 'active' ? user.isActive : !user.isActive);
        }
        if (typeFilter !== 'all') {
            tempUsers = tempUsers.filter(user => user.userType === typeFilter);
        }
        return tempUsers.sort((a, b) => a.name.localeCompare(b.name));
    }, [searchTerm, statusFilter, typeFilter, allUsers]);

    // 3. MUTAÇÃO para atualizar o status do utilizador
    const { mutate: toggleUserStatus, isPending: isUpdatingStatus } = useMutation({
        mutationFn: updateUserStatusApi,
        onSuccess: () => {
            addToast('Status do utilizador atualizado com sucesso!', 'success');
            // Invalida a query 'admin-users' para buscar a lista atualizada automaticamente
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (error: any) => {
            addToast(error.response?.data?.erro || 'Erro ao atualizar status.', 'error');
        }
    });

    const handleToggleUserStatus = (user: User | ProviderDetails) => {
        const action = user.isActive ? 'banir' : 'reativar';
        if (window.confirm(`Tem a certeza que deseja ${action} este utilizador (${user.name})?`)) {
            if (user.email === 'admin@resolveai.com') {
                addToast('A conta de administrador não pode ser banida.', 'warning');
                return;
            }
            toggleUserStatus({ userId: user.id, isActive: !user.isActive });
        }
    };

    const placeholderAvatar = (name?: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=f57c00&color=fff&size=40`;

    if (isLoading) {
        return <div className="text-center py-10">A carregar utilizadores da API...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-red-500">Erro ao carregar utilizadores.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-grafite-profundo mb-6">Gerir Utilizadores</h1>
            <Card className="mb-6 p-4">
                {/* ... O seu JSX de filtros ... */}
            </Card>
            <div className="mb-4 text-sm text-cinza-neutro">
                A exibir {filteredUsers.length} de {allUsers.length} utilizadores.
            </div>
            <Card className="overflow-x-auto">
                <table className="min-w-full">
                    {/* O seu JSX da tabela aqui, mapeando sobre `filteredUsers` */}
                    {/* No botão de banir/reativar, use: onClick={() => handleToggleUserStatus(user)} e disabled={isUpdatingStatus} */}
                </table>
            </Card>
        </div>
    );
};

export default AdminUsersPage;