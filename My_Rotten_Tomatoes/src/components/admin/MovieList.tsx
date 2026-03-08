'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types';
import { deleteMovie } from '@/lib/actions/admin';
import EditMovieForm from './EditMovieForm';

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies: initialMovies }: MovieListProps) {
  const [movies, setMovies] = useState(initialMovies);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const handleDelete = async (movieId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) return;

    try {
      await deleteMovie(movieId);
      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleUpdateSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(movie.releaseDate).toLocaleDateString('fr-FR')}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setEditingMovie(movie)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Modifier {editingMovie.title}</h2>
            <EditMovieForm
              movie={editingMovie}
              onClose={() => setEditingMovie(null)}
              onSuccess={handleUpdateSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}