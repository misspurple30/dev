import { getStats, getTopMovies, getRecentActivity } from '@/lib/actions/admin';
import StatsCards from '@/components/admin/StatsCards';
import TopMoviesChart from '@/components/admin/TopMoviesChart';
import ActivityFeed from '@/components/admin/ActivityFeed';

export default async function StatsPage() {
  const [stats, topMovies, recentActivity] = await Promise.all([
    getStats(),
    getTopMovies(),
    getRecentActivity()
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Statistiques</h1>
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Films les mieux notés</h2>
          <TopMoviesChart movies={topMovies} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <ActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}