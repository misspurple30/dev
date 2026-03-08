'use client';

import { Stats } from '@/types';
import { Users, Film, Star, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Utilisateurs',
      value: stats.userCount,
      sub: `+${stats.newUsersToday} aujourd'hui`,
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: 'Films',
      value: stats.movieCount,
      sub: `${stats.totalGenres} genres`,
      icon: Film,
      color: 'text-purple-400',
    },
    {
      label: 'Avis',
      value: stats.reviewCount,
      sub: `Note moy. ${stats.averageRating.toFixed(1)}/5`,
      icon: Star,
      color: 'text-yellow-400',
    },
    {
      label: 'Note moyenne',
      value: stats.averageRating.toFixed(1),
      sub: 'sur 5 étoiles',
      icon: TrendingUp,
      color: 'text-[#E50914]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, color }) => (
        <div key={label} className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">{label}</span>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-white text-3xl font-bold mb-1">{value}</p>
          <p className={`text-xs ${color}`}>{sub}</p>
        </div>
      ))}
    </div>
  );
}
