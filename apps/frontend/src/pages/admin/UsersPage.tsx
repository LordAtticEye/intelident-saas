import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, Edit2, Trash2, Shield, 
  UserCheck, UserX, Plus, ArrowRight
} from 'lucide-react';
import api from '../../api/axiosClient';
import { UserRole } from '@intelident/shared';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  createdAt: string;
}

export const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();

  // Obtener usuarios
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: () => api.get('/admin/users', { params: { search: searchTerm } }).then(r => r.data.data),
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditModal(false);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      api.put(`/admin/users/${userId}/status`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const users = usersData?.users || [];

  const roleLabels = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.DENTIST]: 'Dentista',
    [UserRole.RECEPTIONIST]: 'Recepcionista',
    [UserRole.PATIENT]: 'Paciente',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-light text-gray-900 tracking-tight">
              Gestión de Usuarios
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1 font-mono">
            Administra roles, permisos y cuentas de usuario
          </p>
        </div>
        <button className="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-mono tracking-wide transition-all duration-200">
          <Plus className="w-4 h-4" />
          Nuevo usuario
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100 pb-6">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 py-2 border-b border-gray-200 text-gray-900 text-sm 
              focus:outline-none focus:border-gray-900 transition-colors bg-transparent
              font-mono placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px bg-gray-100">
        <div className="bg-white p-4">
          <p className="text-xs font-mono text-gray-400">Total usuarios</p>
          <p className="text-2xl font-light text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-4">
          <p className="text-xs font-mono text-gray-400">Administradores</p>
          <p className="text-2xl font-light text-gray-900">
            {users.filter((u: User) => u.role === UserRole.ADMIN).length}
          </p>
        </div>
        <div className="bg-white p-4">
          <p className="text-xs font-mono text-gray-400">Dentistas</p>
          <p className="text-2xl font-light text-gray-900">
            {users.filter((u: User) => u.role === UserRole.DENTIST).length}
          </p>
        </div>
        <div className="bg-white p-4">
          <p className="text-xs font-mono text-gray-400">Pacientes</p>
          <p className="text-2xl font-light text-gray-900">
            {users.filter((u: User) => u.role === UserRole.PATIENT).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-gray-100 bg-white overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="col-span-4">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Usuario</p>
          </div>
          <div className="col-span-3">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Contacto</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Rol</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Estado</p>
          </div>
          <div className="col-span-1 text-right">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Acciones</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {users.map((user: User) => (
            <div key={user._id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
              <div className="col-span-4">
                <p className="text-sm text-gray-900 font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">{user.email}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-gray-500">{user.phone || '—'}</p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="col-span-2">
                <span className={`text-xs font-mono px-2 py-1 ${
                  user.role === UserRole.ADMIN ? 'bg-gray-900 text-white' :
                  user.role === UserRole.DENTIST ? 'bg-blue-50 text-blue-700' :
                  user.role === UserRole.RECEPTIONIST ? 'bg-green-50 text-green-700' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {roleLabels[user.role]}
                </span>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => toggleStatusMutation.mutate({ userId: user._id, isActive: !user.isActive })}
                  className={`flex items-center gap-1 text-xs font-mono ${
                    user.isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
                  }`}
                >
                  {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </button>
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowEditModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este usuario?')) {
                      deleteUserMutation.mutate(user._id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Role Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-light text-gray-900">Cambiar rol de usuario</h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Usuario: <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
              </p>
              <select
                value={selectedUser.role}
                onChange={(e) => {
                  updateRoleMutation.mutate({
                    userId: selectedUser._id,
                    role: e.target.value as UserRole,
                  });
                }}
                className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-900"
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>{roleLabels[role]}</option>
                ))}
              </select>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-mono text-gray-500 hover:text-gray-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};