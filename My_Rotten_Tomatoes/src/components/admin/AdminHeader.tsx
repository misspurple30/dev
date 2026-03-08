'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Films', href: '/admin/movies' },
  { name: 'Utilisateurs', href: '/admin/users' },
  { name: 'Statistiques', href: '/admin/stats' },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
          </div>
          
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                  ${pathname === item.href 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}