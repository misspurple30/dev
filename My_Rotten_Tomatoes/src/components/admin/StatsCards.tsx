'use client';
import { Stats } from '@/types';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Utilisateurs</h3>
        <p className="mt-2 text-3xl font-semibold">{stats.userCount}</p>
        <div className="mt-2 text-green-600 text-sm">
          +{stats.newUsersToday} aujourdhui
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Films</h3>
        <p className="mt-2 text-3xl font-semibold">{stats.movieCount}</p>
        <div className="mt-2 text-green-600 text-sm">
          {stats.totalGenres} genres différents
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Avis</h3>
        <p className="mt-2 text-3xl font-semibold">{stats.reviewCount}</p>
        <div className="mt-2 text-blue-600 text-sm">
          Note moyenne: {stats.averageRating.toFixed(1)}/5
        </div>
      </div>
    </div>
  );
}