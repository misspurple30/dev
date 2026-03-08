'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types';

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">Aucun film trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <Link
          key={movie.id || movie.tmdbId}
          href={`/movies/${movie.id || movie.tmdbId}`}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700 border border-gray-700"
        >
          <div className="relative aspect-[2/3]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-white">{movie.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-yellow-400">
                <span className="mr-1">★</span>
                <span>{(movie.averageRating || 0).toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}