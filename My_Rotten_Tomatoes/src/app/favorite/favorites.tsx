'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import Pagination from '@/components/common/Pagination';

interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  genres: string[];
  averageRating: number;
}

interface FavoritesProps {
  initialMovies: Movie[];
  totalPages: number;
  currentPage: number;
}

export default function Favorites({ initialMovies, totalPages, currentPage }: FavoritesProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fetchFavorites = async (pageNum: number) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/user/favorites?page=${pageNum}`);
      
      if (!res.ok) throw new Error('Erreur lors de la récupération des favoris');
      
      const data = await res.json();
      setMovies(data.movies);
      setPage(pageNum);
    } catch (err) {
      setError('Impossible de charger vos films favoris');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (movieId: number) => {
    try {
      const res = await fetch(`/api/movies/${movieId}/favorite`, {
        method: 'POST',
      });
      
      if (res.ok) {
        setMovies(movies.filter(movie => movie.tmdbId !== movieId));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mes films favoris</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Vous n'avez pas encore de films favoris</p>
          <Link href="/movies" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Découvrir des films
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(movie.tmdbId)}
                    className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition"
                    title="Retirer des favoris"
                  >
                    ❤️
                  </button>
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2 line-clamp-2">{movie.title}</h2>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{movie.averageRating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{movie.overview}</p>
                  
                  <Link href={`/movies/${movie.tmdbId}`} className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={(newPage) => fetchFavorites(newPage)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  
  const page = parseInt(context.query.page || '1');
  
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/favorites?page=${page}`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });
    
    const data = await res.json();
    
    return {
      props: {
        initialMovies: data.movies,
        totalPages: data.pagination.totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return {
      props: {
        initialMovies: [],
        totalPages: 1,
        currentPage: 1,
      },
    };
  }
}