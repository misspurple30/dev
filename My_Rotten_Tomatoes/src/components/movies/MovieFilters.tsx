'use client';
import { useState } from 'react';
import { FilterParams } from '@/types';
import { useRouter, useSearchParams } from 'next/dist/client/components/navigation';

interface MovieFiltersProps {
  genres: string[];
  years: number[];
  initialFilters: FilterParams;
}

export default function MovieFilters({ genres, years, initialFilters }: MovieFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterParams>(initialFilters);

  const handleFilterChange = (key: keyof FilterParams, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        params.set(key, val.toString());
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    router.push(`/movies?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            value={filters.genre || ''}
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('year', Number(e.target.value))}
            value={filters.year || ''}
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note minimale
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
            value={filters.rating || ''}
          >
            <option value="">Toutes les notes</option>
            {[4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>{rating}+ étoiles</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trier par
          </label>
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterParams['sortBy'])}
            value={filters.sortBy || 'releaseDate'}
          >
            <option value="releaseDate">Date de sortie</option>
            <option value="title">Titre</option>
            <option value="averageRating">Note</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full px-3 py-2 border rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <span>Ordre</span>
            <span className="text-lg">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}