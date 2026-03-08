import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  posterPath: string;
  rating: number;
  overview: string;
}

export default function MovieCard({ id, title, posterPath, rating, overview }: MovieCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-[400px]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="ml-1">{rating.toFixed(1)}/5</span>
        </div>
        <p className="text-gray-600 line-clamp-3">{overview}</p>
        <Link 
          href={`/movies/${id}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Voir plus
        </Link>
      </div>
    </div>
  );
}