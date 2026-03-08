'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

interface SearchBarProps {
  directors?: string[];
  initialDirector?: string;
}

export default function SearchBar({ directors = [], initialDirector = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDirector, setSelectedDirector] = useState(searchParams.get('director') || initialDirector);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedDirector(searchParams.get('director') || '');
  }, [searchParams]);

  const updateSearch = useCallback((value: string, director: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams.toString());
    
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }

    if (director) {
      params.set('director', director);
    } else {
      params.delete('director');
    }
    
    params.set('page', '1');
    router.push(`/movies?${params.toString()}`, { scroll: false });
    setIsSearching(false);
  }, [searchParams, router]);

  // Debounce pour la recherche par titre
  const debouncedSearch = useCallback(
    debounce((value: string, director: string) => updateSearch(value, director), 300),
    [updateSearch]
  );

  // Nettoyage du debounce
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Réinitialisation de la recherche
  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedDirector('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('director');
    params.set('page', '1');
    router.push(`/movies?${params.toString()}`);
  };

  const handleDirectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDirector = e.target.value;
    setSelectedDirector(newDirector);
    updateSearch(searchTerm, newDirector);
  };

  return (
    <div className="relative mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e.target.value, selectedDirector);
            }}
            placeholder="Rechercher un film par titre..."
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10"
            aria-label="Rechercher un film"
          />
          
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 ${isSearching ? 'text-blue-500 animate-spin' : 'text-gray-400'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {(searchTerm || selectedDirector) && (
            <button 
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <select
          value={selectedDirector}
          onChange={handleDirectorChange}
          className="w-full sm:w-72 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Sélectionner un réalisateur"
        >
          <option value="">Tous les réalisateurs</option>
          {directors.map((director) => (
            <option key={director} value={director}>{director}</option>
          ))}
        </select>
      </div>

      <div className="absolute mt-1 text-sm text-gray-500">
        {isSearching ? 'Recherche en cours...' : 
          searchTerm || selectedDirector ? 
            `Recherche ${searchTerm ? `"${searchTerm}"` : ''} ${selectedDirector ? `par ${selectedDirector}` : ''}`.trim() : 
            'Tapez un titre ou sélectionnez un réalisateur'}
      </div>
    </div>
  );
}