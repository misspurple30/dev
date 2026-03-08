import UserForm from '@/components/admin/UserForm';
import UserList from '@/components/admin/UserList';
import { getAllUsers } from '@/lib/actions/admin';
import { Suspense } from 'react';
import { Users } from 'lucide-react';

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }> | { page?: string }
}) {
  const params = await Promise.resolve(searchParams);
  const page = params.page ? parseInt(params.page) : 1;
  const { users, pagination } = await getAllUsers(page);

  return (
    <main className="min-h-screen bg-[#141414] px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Ajouter un utilisateur</h2>
          <UserForm />
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Liste des utilisateurs</h2>
          <Suspense fallback={<div className="text-gray-400 text-sm">Chargement...</div>}>
            <UserList users={users} totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
