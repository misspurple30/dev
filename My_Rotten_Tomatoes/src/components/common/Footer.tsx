'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdMovieFilter, MdLocalMovies } from 'react-icons/md';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const categories = [
    { name: 'Action', href: '/genre/action' },
    { name: 'Comédie', href: '/genre/comedy' },
    { name: 'Drame', href: '/genre/drama' },
    { name: 'Science-Fiction', href: '/genre/sci-fi' },
    { name: 'Horreur', href: '/genre/horror' },
    { name: 'Documentaire', href: '/genre/documentary' },
  ];
  
  const links = [
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MdMovieFilter className="text-3xl text-red-600" />
              <span className="text-xl font-bold text-white">My Rotten Tomatoes</span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre plateforme de référence pour découvrir, noter et partager vos films préférés.
            </p>
            <div className="flex space-x-4 text-xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <FaYoutube />
              </a>
            </div>
          </div>
        
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Genres populaires</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href} className="text-gray-400 hover:text-white transition">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Liens utiles</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Restez informé</h3>
            <p className="text-gray-400 mb-4">
              Abonnez-vous à notre newsletter pour recevoir les dernières sorties et recommandations de films.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MdLocalMovies className="text-red-600 mr-2" />
            <p className="text-gray-400">
              © {currentYear} My Rotten Tomatoes. Tous droits réservés.
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            Conçu avec passion par des cinéphiles pour des cinéphiles
          </p>
        </div>
      </div>
    </footer>
  );
}