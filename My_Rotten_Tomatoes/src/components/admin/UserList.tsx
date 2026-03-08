'use client';
import { useState } from 'react';
import { User } from '@/types';
import { updateUserRole, deleteUser } from '@/lib/actions/admin';
import UserForm from './UserForm';
import Pagination from '@/components/common/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface UserListProps {
  users: User[];
  totalPages: number;
  currentPage: number;
}

export default function UserList({ users: initialUsers, totalPages, currentPage }: UserListProps) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // propres droits d'admin
      if (userId === currentUserId && newRole !== 'admin') {
        alert('Vous avez retiré vos propres droits d\'administrateur. Vous allez être redirigé.');
        router.push('/');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUserId) {
      alert('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleUpdateSuccess = () => {
    setEditingUser(null);
    window.location.reload();
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user.id, e.target.value as 'user' | 'admin')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={user.id === currentUserId}
                    >
                      {user.id === currentUserId ? 'hummmm.' : 'Supprimer'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/users"
      />

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Modifier {editingUser.name}</h2>
            <UserForm
              user={editingUser}
              onSuccess={handleUpdateSuccess}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}