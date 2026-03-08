import { getStats } from '@/lib/actions/admin';
import StatsCards from '@/components/admin/StatsCards';
import TopMoviesChart from '@/components/admin/TopMoviesChart';
import { BarChart2 } from 'lucide-react';

export default async function AdminStatsPage() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-[#141414] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BarChart2 className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        </div>

        <div className="space-y-8">
          <StatsCards stats={stats} />
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
            <h2 className="text-white font-semibold mb-4">Top films les mieux notés</h2>
            <TopMoviesChart />
          </div>
        </div>
      </div>
    </main>
  );
}
