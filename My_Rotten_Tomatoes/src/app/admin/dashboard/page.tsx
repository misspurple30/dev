import Link from 'next/link';
import { getStats } from '@/lib/actions/admin';

export default async function AdminDashboard() {


  const stats = await getStats();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
          <p className="text-3xl font-bold">{stats.userCount}</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
            Gérer les utilisateurs →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Films</h3>
          <p className="text-3xl font-bold">{stats.movieCount}</p>
          <Link href="/admin/movies" className="text-blue-600 hover:underline mt-2 inline-block">
            Gérer les films →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Avis</h3>
          <p className="text-3xl font-bold">{stats.reviewCount}</p>
          <Link href="/admin/reviews" className="text-blue-600 hover:underline mt-2 inline-block">
            Voir les avis →
          </Link>
        </div>
      </div>
    </div>
  );
}