'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface MovieFiltersProps {
  genres: string[];
  years: number[];
  initialFilters: {
    genre?: string;
    year?: string;
    rating?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function MovieFilters({ genres, years, initialFilters }: MovieFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);

  const hasActiveFilters = filters.genre || filters.year || filters.rating;

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`?${params.toString()}`);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ['genre', 'year', 'rating', 'sortBy', 'sortOrder'].forEach(k => params.delete(k));
    params.delete('page');
    router.push(`?${params.toString()}`);
    setFilters({});
  };

  const selectClass = "bg-[#181818] border border-[#333] text-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer hover:border-[#555]";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-400">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filtres</span>
      </div>

      <select value={filters.genre || ''} onChange={e => applyFilter('genre', e.target.value)} className={selectClass}>
        <option value="">Tous les genres</option>
        {genres.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <select value={filters.year || ''} onChange={e => applyFilter('year', e.target.value)} className={selectClass}>
        <option value="">Toutes les années</option>
        {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
      </select>

      <select value={filters.rating || ''} onChange={e => applyFilter('rating', e.target.value)} className={selectClass}>
        <option value="">Toutes les notes</option>
        {[1, 2, 3, 4].map(r => <option key={r} value={String(r)}>{r}+ ★</option>)}
      </select>

      <select value={filters.sortBy || 'releaseDate'} onChange={e => applyFilter('sortBy', e.target.value)} className={selectClass}>
        <option value="releaseDate">Date de sortie</option>
        <option value="averageRating">Note</option>
        <option value="title">Titre</option>
      </select>

      <select value={filters.sortOrder || 'desc'} onChange={e => applyFilter('sortOrder', e.target.value)} className={selectClass}>
        <option value="desc">↓ Décroissant</option>
        <option value="asc">↑ Croissant</option>
      </select>

      {hasActiveFilters && (
        <button onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-[#E50914] hover:text-red-400 transition-colors border border-[#E50914]/30 hover:border-[#E50914] px-3 py-2 rounded">
          <X className="w-3 h-3" />
          Effacer
        </button>
      )}
    </div>
  );
}
