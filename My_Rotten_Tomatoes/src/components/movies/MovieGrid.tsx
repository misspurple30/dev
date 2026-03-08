'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types';
import { Star, Play } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4">🎬</p>
        <p className="text-white text-xl font-semibold mb-2">Aucun film trouvé</p>
        <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link key={movie.id || movie.tmdbId} href={`/movies/${movie.id || movie.tmdbId}`}>
          <div className="movie-card relative bg-[#181818] rounded-sm overflow-hidden group cursor-pointer">
            {/* Poster */}
            <div className="relative h-[260px] overflow-hidden">
              {movie.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="w-full h-full bg-[#333] flex items-center justify-center">
                  <Play className="w-10 h-10 text-[#555]" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Rating */}
              {(movie.averageRating ?? 0) > 0 && (
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
                  <span className="text-white text-xs font-semibold">{(movie.averageRating ?? 0).toFixed(1)}</span>
                </div>
              )}

              {/* Year badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-xs text-gray-300">
                {new Date(movie.releaseDate).getFullYear()}
              </div>
            </div>

            {/* Title */}
            <div className="p-2">
              <h3 className="text-white text-xs font-medium line-clamp-2 leading-tight">{movie.title}</h3>
            </div>

            {/* Red bottom border on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>
        </Link>
      ))}
    </div>
  );
}
