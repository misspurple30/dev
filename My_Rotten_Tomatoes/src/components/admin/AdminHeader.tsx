'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, Users, BarChart2, MessageSquare } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Films', href: '/admin/movies', icon: Film },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Avis', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Statistiques', href: '/admin/stats', icon: BarChart2 },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <div className="bg-[#0a0a0a] border-b border-[#222] px-6 py-3">
      <div className="flex items-center gap-1 overflow-x-auto">
        {navigation.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === href
                ? 'bg-[#E50914] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
