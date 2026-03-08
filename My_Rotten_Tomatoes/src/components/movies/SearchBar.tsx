'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  directors?: string[];
  initialDirector?: string;
}

export default function SearchBar({ directors = [], initialDirector = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDirector, setSelectedDirector] = useState(searchParams.get('director') || initialDirector);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedDirector(searchParams.get('director') || '');
  }, [searchParams]);

  const updateSearch = useCallback((value: string, director: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set('search', value.trim()); else params.delete('search');
    if (director) params.set('director', director); else params.delete('director');
    params.set('page', '1');
    router.push(`/movies?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const debouncedSearch = useCallback(
    debounce((value: string, director: string) => updateSearch(value, director), 300),
    [updateSearch]
  );

  useEffect(() => () => { debouncedSearch.cancel(); }, [debouncedSearch]);

  const handleClear = () => {
    setSearchTerm('');
    setSelectedDirector('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('director');
    params.set('page', '1');
    router.push(`/movies?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debouncedSearch(e.target.value, selectedDirector);
          }}
          placeholder="Rechercher un film..."
          className="input-netflix pl-9 pr-8"
        />
        {(searchTerm || selectedDirector) && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <select
        value={selectedDirector}
        onChange={(e) => {
          setSelectedDirector(e.target.value);
          updateSearch(searchTerm, e.target.value);
        }}
        className="bg-[#181818] border border-[#333] text-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:border-[#E50914] transition-colors sm:w-56"
      >
        <option value="">Tous les réalisateurs</option>
        {directors.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}
