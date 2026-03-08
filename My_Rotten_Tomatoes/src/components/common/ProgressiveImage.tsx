'use client';
import { motion } from 'framer-motion';
import MovieCard from '@/components/common/MovieCard';
import { Movie } from '@/types';

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <MovieCard
            id={movie.id}
            title={movie.title}
            posterPath={movie.posterPath}
            rating={movie.averageRating}
            overview={movie.overview}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}