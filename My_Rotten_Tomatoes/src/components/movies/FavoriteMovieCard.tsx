import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface FavoriteMovieCardProps {
  tmdbId: number;
  title: string;
  posterPath: string;
  rating: number;
}

export default function FavoriteMovieCard({ tmdbId, title, posterPath, rating }: FavoriteMovieCardProps) {
  return (
    <Link href={`/movies/${tmdbId}`}>
      <div className="flex items-center gap-3 p-2 rounded hover:bg-[#222] transition-colors group">
        <div className="relative w-10 h-14 shrink-0 overflow-hidden rounded">
          {posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w200${posterPath}`}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#333]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#E50914] transition-colors">{title}</p>
          {rating > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
              <span className="text-gray-400 text-xs">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
