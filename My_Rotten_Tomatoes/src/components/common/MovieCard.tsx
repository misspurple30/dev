import Image from 'next/image';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  posterPath: string;
  rating: number;
  overview: string;
}

export default function MovieCard({ id, title, posterPath, rating, overview }: MovieCardProps) {
  return (
    <Link href={`/movies/${id}`}>
      <div className="movie-card relative bg-[#181818] rounded-sm overflow-hidden cursor-pointer group">
        {/* Poster */}
        <div className="relative h-[280px] w-full overflow-hidden">
          {posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#333] flex items-center justify-center">
              <Play className="w-12 h-12 text-[#555]" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Rating badge */}
          {rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
              <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{title}</h3>
          <p className="text-gray-400 text-xs line-clamp-2">{overview}</p>
        </div>

        {/* Bottom red line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  );
}
