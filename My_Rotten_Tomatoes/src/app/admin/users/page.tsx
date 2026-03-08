import UserForm from '@/components/admin/UserForm';
import UserList from '@/components/admin/UserList';
import { getAllUsers } from '@/lib/actions/admin';
import { Suspense } from 'react';

export default async function UsersPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { users, pagination } = await getAllUsers(page);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Ajouter un utilisateur</h2>
        <UserForm />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Liste des utilisateurs</h2>
        <Suspense fallback={<div>Chargement des utilisateurs...</div>}>
          <UserList 
            users={users} 
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
          />
        </Suspense>
      </section>
    </div>
  );
}