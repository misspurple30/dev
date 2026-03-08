import Link from 'next/link';
import { getStats } from '@/lib/actions/admin';
import { Users, Film, MessageSquare, ArrowRight, Shield } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Utilisateurs', value: stats.userCount, href: '/admin/users', icon: Users, color: 'text-blue-400' },
    { label: 'Films', value: stats.movieCount, href: '/admin/movies', icon: Film, color: 'text-purple-400' },
    { label: 'Avis', value: stats.reviewCount, href: '/admin/reviews', icon: MessageSquare, color: 'text-yellow-400' },
  ];

  return (
    <main className="min-h-screen bg-[#141414] pt-6 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-7 h-7 text-[#E50914]" />
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {cards.map(({ label, value, href, icon: Icon, color }) => (
            <div key={label} className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-white text-4xl font-bold mb-4">{value}</p>
              <Link href={href} className={`flex items-center gap-1 text-sm ${color} hover:opacity-80 transition-opacity`}>
                Gérer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/movies/add"
            className="bg-[#181818] border border-[#2a2a2a] hover:border-[#E50914] rounded-lg p-5 flex items-center justify-between group transition-colors">
            <div>
              <p className="text-white font-medium mb-1">Ajouter un film</p>
              <p className="text-gray-400 text-sm">Ajouter manuellement un film au catalogue</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#E50914] transition-colors" />
          </Link>

          <Link href="/admin/stats"
            className="bg-[#181818] border border-[#2a2a2a] hover:border-[#E50914] rounded-lg p-5 flex items-center justify-between group transition-colors">
            <div>
              <p className="text-white font-medium mb-1">Voir les statistiques</p>
              <p className="text-gray-400 text-sm">Graphiques et analyses détaillées</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#E50914] transition-colors" />
          </Link>
        </div>
      </div>
    </main>
  );
}
