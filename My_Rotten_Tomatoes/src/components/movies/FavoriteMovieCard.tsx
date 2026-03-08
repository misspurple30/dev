'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarRating } from '@/components/common/StarRating';

interface FavoriteMovieCardProps {
  tmdbId: number;
  title: string;
  posterPath: string;
  rating: number;
}

export default function FavoriteMovieCard({ tmdbId, title, posterPath, rating }: FavoriteMovieCardProps) {
  return (
    <Link 
      href={`/movies/${tmdbId}`} 
      className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="relative w-16 h-24 flex-shrink-0">
        <Image
          src={`https://image.tmdb.org/t/p/w92${posterPath}`}
          alt={title}
          fill
          className="rounded-md object-cover"
          sizes="64px"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{title}</h3>
        <div className="mt-1">
          <StarRating value={rating} readonly size="sm" />
        </div>
      </div>
    </Link>
  );
}