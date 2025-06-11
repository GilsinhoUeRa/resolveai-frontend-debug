
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { User, ProviderDetails, UserType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { BanIcon } from '@/components/icons/BanIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { APP_ROUTES } from '@/constants';


const AdminUsersPage: React.FC = () => {
  const { allUsers, updateUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate(); // Initialize navigate

  const [users, setUsers] = useState<(User | ProviderDetails)[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(User | ProviderDetails)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>(queryParams.get('status') as any || 'all');
  const [typeFilter, setTypeFilter] = useState<'all' | UserType.CLIENT | UserType.PROVIDER>(queryParams.get('type') as any || 'all');


  const processedAllUsers = useMemo(() => {
    return allUsers.map(u => ({
      ...u,
      isActive: u.isActive === undefined ? true : u.isActive,
    }));
  }, [allUsers]);

  useEffect(() => {
    if (!authLoading) {
      setUsers(processedAllUsers);
      setIsLoading(false);
    }
  }, [processedAllUsers, authLoading]);
  
  // Effect to update URL when filter states change (optional, good for shareable links)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    navigate(`${APP_ROUTES.ADMIN_USERS}?${params.toString()}`, { replace: true });
  }, [searchTerm, statusFilter, typeFilter, navigate]);


  useEffect(() => {
    let tempUsers = [...users];

    if (searchTerm) {
      tempUsers = tempUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      tempUsers = tempUsers.filter(user =>
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }
    
    if (typeFilter !== 'all') {
        tempUsers = tempUsers.filter(user => user.userType === typeFilter);
    }

    setFilteredUsers(tempUsers.sort((a, b) => a.name.localeCompare(b.name)));
  }, [searchTerm, statusFilter, typeFilter, users]);

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) {
      addToast('Usuário não encontrado.', 'error');
      return;
    }

    const action = currentStatus ? 'banir' : 'reativar';
    if (window.confirm(`Tem certeza que deseja ${action} este usuário (${userToUpdate.name})?`)) {
      try {
        if (userToUpdate.email === 'admin@resolveai.com') {
            addToast('A conta de administrador não pode ser banida por esta interface.', 'warning');
            return;
        }
        await updateUser({ id: userId, isActive: !currentStatus });
        addToast(`Usuário ${userToUpdate.name} foi ${action === 'banir' ? 'banido' : 'reativado'} com sucesso!`, 'success');
        // A lista será atualizada automaticamente devido à mudança em `allUsers` no context
      } catch (error: any) {
        addToast(`Erro ao ${action} usuário: ${error.message || 'Erro desconhecido'}`, 'error');
      }
    }
  };
  
  const placeholderAvatar = (name?: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=f57c00&color=fff&size=40`;

  if (isLoading) {
    return <div className="text-center py-10">Carregando usuários...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-grafite-profundo mb-6">Gerenciar Usuários</h1>

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Buscar por Nome ou Email"
            name="searchTerm"
            type="search"
            placeholder="Digite para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="!mb-0"
          />
          <Select
            label="Filtrar por Tipo"
            name="typeFilter"
            options={[
              { value: 'all', label: 'Todos os Tipos' },
              { value: UserType.CLIENT, label: 'Cliente' },
              { value: UserType.PROVIDER, label: 'Prestador' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            containerClassName="!mb-0"
          />
          <Select
            label="Filtrar por Status"
            name="statusFilter"
            options={[
              { value: 'all', label: 'Todos os Status' },
              { value: 'active', label: 'Ativos' },
              { value: 'banned', label: 'Banidos' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'banned')}
            containerClassName="!mb-0"
          />
        </div>
      </Card>
      
      <div className="mb-4 text-sm text-cinza-neutro">
        Exibindo {filteredUsers.length} de {users.length} usuários.
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <p className="text-center text-cinza-neutro py-8">Nenhum usuário encontrado com os filtros aplicados.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Foto</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Email</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Cidade</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-grafite-profundo uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-grafite-profundo uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <img 
                        src={user.photoUrl || placeholderAvatar(user.name)} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            if (e.currentTarget.src !== placeholderAvatar(user.name)) {
                                e.currentTarget.src = placeholderAvatar(user.name);
                            }
                        }}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-grafite-profundo">{user.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-cinza-neutro">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.userType === UserType.PROVIDER 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.userType === UserType.PROVIDER ? 'Prestador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-cinza-neutro">{user.city || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Ativo' : 'Banido'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {user.email !== 'admin@resolveai.com' && ( 
                        <Button 
                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                            variant={user.isActive ? 'danger' : 'primary'} 
                            size="sm" 
                            className="!px-2 !py-1"
                            title={user.isActive ? 'Banir Usuário' : 'Reativar Usuário'}
                        >
                            {user.isActive ? <BanIcon size={16} /> : <CheckCircleIcon size={16} />}
                        </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default AdminUsersPage;
