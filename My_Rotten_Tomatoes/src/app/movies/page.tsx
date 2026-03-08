import { getFilteredMovies, getAvailableGenres, getAvailableYears, getAvailableDirectors } from '@/lib/actions/movies';
import MovieFilters from '@/components/movies/MovieFilters';
import MovieGrid from '@/components/movies/MovieGrid';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/movies/SearchBar';
import { FilterParams } from '@/types';
import { Suspense } from 'react';
import LoadingMovies from '@/components/movies/LoadingMovies';

interface SearchParams {
  genre?: string;
  year?: string;
  rating?: string;
  director?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: string;
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const params = await Promise.resolve(searchParams);

  const [{ movies, pagination }, genres, years, directors] = await Promise.all([
    getFilteredMovies(
      {
        genre: params.genre,
        year: params.year ? parseInt(params.year) : undefined,
        rating: params.rating ? parseInt(params.rating) : undefined,
        director: params.director,
        sortBy: (params.sortBy as FilterParams['sortBy']) || 'releaseDate',
        sortOrder: (params.sortOrder as 'asc' | 'desc') || 'desc',
        search: params.search,
      },
      parseInt(params.page || '1')
    ),
    getAvailableGenres(),
    getAvailableYears(),
    getAvailableDirectors(),
  ]);

  return (
    <main className="min-h-screen bg-[#141414] pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Catalogue</h1>
          <p className="text-gray-400 text-sm">{pagination.total} films disponibles</p>
        </div>

        <Suspense fallback={<LoadingMovies />}>
          <SearchBar directors={directors} initialDirector={params.director} />

          <div className="mb-8 mt-4">
            <MovieFilters
              genres={genres}
              years={years}
              initialFilters={{
                genre: params.genre,
                year: params.year,
                rating: params.rating,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
              }}
            />
          </div>

          {movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-4xl mb-4">🎬</p>
              <p className="text-white text-xl font-semibold mb-2">Aucun film trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <MovieGrid movies={movies} />
          )}

          <div className="mt-10">
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
