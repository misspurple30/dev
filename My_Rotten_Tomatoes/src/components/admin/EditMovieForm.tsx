'use client';

import { useState } from 'react';
import { Movie } from '@/types';
import { updateMovie } from '@/lib/actions/admin';

interface EditMovieFormProps {
  movie: Movie;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditMovieForm({ movie, onClose, onSuccess }: EditMovieFormProps) {
  const [formData, setFormData] = useState({
    title: movie.title,
    overview: movie.overview,
    genres: movie.genres.join(', '),
    director: movie.director
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateMovie(movie.id, {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim())
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Synopsis</label>
        <textarea
          value={formData.overview}
          onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Genres (séparés par des virgules)</label>
        <input
          type="text"
          value={formData.genres}
          onChange={(e) => setFormData(prev => ({ ...prev, genres: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Réalisateur</label>
        <input
          type="text"
          value={formData.director}
          onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}