'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === 'admin';
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log("Session dans Header:", session);
  console.log("Role utilisateur:", session?.user?.role);
  console.log("isAdmin:", isAdmin);

  const navigation = [
    { name: 'Films', href: '/movies' },
    ...(session?.user ? [{ name: 'Mon Profil', href: '/profile' }] : []),
    ...(isAdmin ? [{ name: 'Admin', href: '/admin/dashboard' }] : []),
  ];

  const handleNavigationClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 shadow-md border-b border-gray-800">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-gray-300 transition"
            >
              My Rotten Tomatoes
            </Link>
          </div>
          
          <button 
            className="md:hidden text-gray-300 hover:text-white focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div className="hidden md:flex gap-4 items-center">
            {status === "loading" ? (
              <span className="text-sm text-gray-300">Chargement...</span>
            ) : (
              <>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
               
                {session?.user ? (
                  <button
                    onClick={() => signOut()}
                    className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/auth/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Menu mobile*/}
        {isMenuOpen && (
          <div className="md:hidden py-3 pb-5 border-t border-gray-700">
            {status === "loading" ? (
              <div className="px-2 py-3 text-center">
                <span className="text-sm text-gray-300">Chargement...</span>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={handleNavigationClick}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {session?.user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-left"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/auth/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={handleNavigationClick}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={handleNavigationClick}
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}