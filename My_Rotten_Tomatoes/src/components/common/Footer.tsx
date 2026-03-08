'use client';

import Link from 'next/link';
import { Film } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Action', href: '/movies?genre=Action' },
    { name: 'Comédie', href: '/movies?genre=Comédie' },
    { name: 'Drame', href: '/movies?genre=Drame' },
    { name: 'Science-Fiction', href: '/movies?genre=Science-Fiction' },
    { name: 'Horreur', href: '/movies?genre=Horreur' },
    { name: 'Documentaire', href: '/movies?genre=Documentaire' },
  ];

  const links = [
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="bg-[#141414] border-t border-[#333] text-gray-400 mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-[#E50914]" />
              <span className="text-lg font-bold text-white">MyRottenTomatoes</span>
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Votre plateforme de référence pour découvrir, noter et partager vos films préférés.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: FaFacebook, href: 'https://facebook.com' },
                { Icon: FaTwitter, href: 'https://twitter.com' },
                { Icon: FaInstagram, href: 'https://instagram.com' },
                { Icon: FaYoutube, href: 'https://youtube.com' },
              ].map(({ Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#E50914] transition-colors duration-200">
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Genres</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link href={cat.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Liens</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-gray-500 mb-4">
              Recevez les dernières sorties et recommandations.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="input-netflix text-sm"
              />
              <button className="btn-netflix text-sm rounded">S'abonner</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-600">© {currentYear} MyRottenTomatoes. Tous droits réservés.</p>
          <p className="text-xs text-gray-600">Conçu avec passion par des cinéphiles pour des cinéphiles</p>
        </div>
      </div>
    </footer>
  );
}
