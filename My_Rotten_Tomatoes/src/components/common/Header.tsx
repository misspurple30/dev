'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Film, Menu, X, User, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === 'admin';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Film className="w-6 h-6 text-[#E50914]" />
            <span className="text-xl font-bold text-[#E50914] tracking-tight">
              MyRottenTomatoes
            </span>
          </Link>

          {/* Nav desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/movies"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/movies'
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Films
            </Link>

            {session?.user && (
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === '/profile'
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Mon Profil
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 text-sm font-medium text-[#E50914] hover:text-red-400 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Auth buttons desktop */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-20 h-8 skeleton rounded" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center text-white font-semibold text-xs">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-white font-medium hover:text-gray-300 transition-colors px-3 py-1"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-netflix text-sm px-4 py-2 rounded"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#333] flex flex-col gap-3 pt-4">
            <Link href="/movies" className="text-gray-300 hover:text-white text-sm" onClick={() => setIsMenuOpen(false)}>Films</Link>
            {session?.user && (
              <Link href="/profile" className="text-gray-300 hover:text-white text-sm" onClick={() => setIsMenuOpen(false)}>Mon Profil</Link>
            )}
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-[#E50914] text-sm" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            )}
            {session?.user ? (
              <button onClick={() => signOut()} className="text-gray-400 hover:text-white text-sm text-left">Déconnexion</button>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-300 hover:text-white text-sm" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                <Link href="/auth/register" className="btn-netflix text-sm text-center rounded" onClick={() => setIsMenuOpen(false)}>S'inscrire</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
