'use client';

import { useState, useEffect } from 'react';
import { searchMoviesFromTMDB } from '@/lib/tmdb';
import { addManualMovie, addMovie, getMovies } from '@/lib/actions/admin';
import { useRouter } from 'next/navigation';
import { Movie } from '@/types';
import Image from 'next/image';

export default function MovieForm() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingMovies, setExistingMovies] = useState<Movie[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualMovie, setManualMovie] = useState({
    title: '',
    overview: '',
    releaseDate: '',
    director: '',
    genres: [] as string[],
    genre: ''
  });
  
  const router = useRouter();

  useEffect(() => {
    const fetchExistingMovies = async () => {
      try {
        const movies = await getMovies();
        setExistingMovies(movies);
      } catch (error) {
        console.error("Erreur lors du chargement des films existants:", error);
      }
    };
    
    fetchExistingMovies();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const results = await searchMoviesFromTMDB(search);
      setSearchResults(results.results || []);
    } catch (error) {
      setError('Erreur lors de la recherche. Vérifiez la clé API TMDB.');
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const isMovieInDatabase = (tmdbId: number) => {
    return existingMovies.some(movie => movie.tmdbId === tmdbId);
  };

  const handleAddMovie = async (tmdbId: number) => {
    if (isMovieInDatabase(tmdbId)) {
      setError('Ce film est déjà dans votre base de données');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const newMovie = await addMovie(tmdbId);
      // Ajouter le nouveau film à notre liste locale
      setExistingMovies([...existingMovies, newMovie]);
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'ajout du film');
      console.error('Erreur lors de l\'ajout du film:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualMovie.title) {
      setError('Le titre du film est requis');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const newMovie = await addManualMovie({
        title: manualMovie.title,
        overview: manualMovie.overview,
        releaseDate: manualMovie.releaseDate,
        director: manualMovie.director,
        genres: manualMovie.genres
      });
      
      setExistingMovies([...existingMovies, newMovie]);
      
      setManualMovie({
        title: '',
        overview: '',
        releaseDate: '',
        director: '',
        genres: [],
        genre: ''
      });
      
      setShowManualForm(false);
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'ajout manuel du film');
    } finally {
      setLoading(false);
    }
  };
  
  const addGenre = () => {
    if (manualMovie.genre && !manualMovie.genres.includes(manualMovie.genre)) {
      setManualMovie({
        ...manualMovie,
        genres: [...manualMovie.genres, manualMovie.genre],
        genre: ''
      });
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setManualMovie({
      ...manualMovie,
      genres: manualMovie.genres.filter(genre => genre !== genreToRemove)
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Ajouter un film</h2>
        <button 
          onClick={() => setShowManualForm(!showManualForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showManualForm ? 'Rechercher un film' : 'Ajouter manuellement'}
        </button>
      </div>

      {!showManualForm ? (
        <>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un film..."
                className="flex-1 px-4 py-2 border rounded"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </form>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((movie) => {
                const isInDatabase = isMovieInDatabase(movie.id);
                return (
                  <div key={movie.id} className="border rounded overflow-hidden">
                    <div className="relative h-48">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200">
                          <span>Pas d'image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{movie.title}</h3>
                      <p className="text-sm text-gray-600">
                        {movie.release_date?.split('-')[0] || 'Date inconnue'}
                      </p>
                      <button
                        onClick={() => handleAddMovie(movie.id)}
                        disabled={loading || isInDatabase}
                        className={`mt-2 px-3 py-1 rounded ${
                          isInDatabase 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isInDatabase ? 'Déjà ajouté' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleManualAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre*
            </label>
            <input
              type="text"
              value={manualMovie.title}
              onChange={(e) => setManualMovie({...manualMovie, title: e.target.value})}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Synopsis
            </label>
            <textarea
              value={manualMovie.overview}
              onChange={(e) => setManualMovie({...manualMovie, overview: e.target.value})}
              className="w-full px-4 py-2 border rounded"
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de sortie
            </label>
            <input
              type="date"
              value={manualMovie.releaseDate}
              onChange={(e) => setManualMovie({...manualMovie, releaseDate: e.target.value})}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Réalisateur
            </label>
            <input
              type="text"
              value={manualMovie.director}
              onChange={(e) => setManualMovie({...manualMovie, director: e.target.value})}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genres
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualMovie.genre}
                onChange={(e) => setManualMovie({...manualMovie, genre: e.target.value})}
                className="flex-1 px-4 py-2 border rounded"
                placeholder="Ajouter un genre..."
              />
              <button
                type="button"
                onClick={addGenre}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
            
            {manualMovie.genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {manualMovie.genres.map((genre) => (
                  <span 
                    key={genre} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !manualMovie.title}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Envoi...' : 'Ajouter le film'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}