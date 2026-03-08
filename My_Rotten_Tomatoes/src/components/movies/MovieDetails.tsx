'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaLink } from 'react-icons/fa';
import { Movie } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface MovieDetailsProps {
  movie: Movie;
  userSession: Session | null;
}

export default function MovieDetails({ movie: initialMovie, userSession }: MovieDetailsProps) {
  const [movie, setMovie] = useState(initialMovie);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    if (userSession) { 
      setIsFavorite(movie.favorites?.includes(userSession.user.id) || false);
    }
  }, [movie.favorites, userSession]);

  const handleToggleFavorite = async () => {
    if (!userSession) return;
  
    setIsTogglingFavorite(true);
    setError('');
  
    try {
      const response = await fetch(`/api/movies/${movie.tmdbId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la modification des favoris');
      }
  
      const data = await response.json();
      

      setIsFavorite(!isFavorite);
      setMovie(prev => ({
        ...prev,
        favorites: data.isFavorite 
          ? [...(prev.favorites || []), userSession.user.id]
          : prev.favorites.filter(id => id !== userSession.user.id)
      }));
  
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la modification des favoris');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/movies/${movie.tmdbId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'avis');
      }

      const result = await response.json();
      
      const newReview = {
        ...result.review,
        userName: userSession?.user.name || 'Utilisateur'
      };
      
      setMovie({
        ...movie,
        reviews: [...(movie.reviews || []), newReview],
        averageRating: result.averageRating
      });
      
      setIsAddingReview(false);
      setRating(0);
      setComment('');
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Découvrez ${movie.title} sur My Rotten Tomatoes!`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Lien copié !');
        } catch (err) {
          toast.error('Erreur lors de la copie du lien');
        }
        break;
    }
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  if (!movie) return <p className="text-white">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Image en arrière-plan */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdropPath || movie.posterPath}`}
          alt={movie.title}
          fill
          className="object-cover opacity-50"
        />
      </div>

      <div className="container mx-auto mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Affiche du film */}
          <div className="w-full md:w-1/3 flex justify-center">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              width={400}
              height={600}
              className="rounded-lg shadow-lg"
              alt={movie.title}
            />
          </div>

          {/* Infos du film */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-300 italic">{movie.tagline}</p>}

            <div className="flex items-center gap-4 text-gray-300 mt-2">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl mr-1">★</span>
                <span>{movie.averageRating?.toFixed(1) || 'N/A'}</span>
              </div>
              <span>•</span>
              <span>{format(new Date(movie.releaseDate), 'd MMMM yyyy', { locale: fr })}</span>
              {movie.director && (
                <>
                  <span>•</span>
                  <span>Réalisé par {movie.director}</span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres?.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <p className="mt-4 text-gray-300">{movie.overview}</p>

            {/* Boutons de partage */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Partager ce film</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] hover:bg-[#1664d9] rounded-lg transition-colors text-white"
            aria-label="Partager sur Facebook"
          >
            <FaFacebook className="text-xl" />
            <span className="hidden sm:inline">Facebook</span>
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1da1f2] hover:bg-[#1a91da] rounded-lg transition-colors text-white"
            aria-label="Partager sur Twitter"
          >
            <FaTwitter className="text-xl" />
            <span className="hidden sm:inline">Twitter</span>
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a66c2] hover:bg-[#094d92] rounded-lg transition-colors text-white"
            aria-label="Partager sur LinkedIn"
          >
            <FaLinkedin className="text-xl" />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center gap-2 px-4 py-2 bg-[#25d366] hover:bg-[#1fb959] rounded-lg transition-colors text-white"
            aria-label="Partager sur WhatsApp"
          >
            <FaWhatsapp className="text-xl" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare('copy')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
            aria-label="Copier le lien"
          >
            <FaLink className="text-xl" />
            <span className="hidden sm:inline">Copier le lien</span>
          </button>
        </div>
      </div>
            
            {/* Bouton favoris */}
            {userSession && (
              <button 
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`mt-6 ${
                  isFavorite ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
                } px-6 py-3 rounded-lg text-lg font-semibold transition flex items-center gap-2`}
              >
                {isFavorite ? '❤️ Retirer des favoris' : '❤️ Ajouter aux favoris'}
                {isTogglingFavorite && (
                  <span className="animate-spin">⟳</span>
                )}
              </button>
            )}

            {/* Section Avis */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Avis ({movie.reviews?.length || 0})
                </h3>
                {userSession && !isAddingReview && (
                  <button
                    onClick={() => setIsAddingReview(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold transition"
                  >
                    Ajouter un avis
                  </button>
                )}
              </div>

              {/* Système de notation*/}
              {userSession && isAddingReview && (
                <form onSubmit={handleSubmitReview} className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Notez ce film :</h3>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className={`text-3xl ${
                            star <= rating ? "text-yellow-400" : "text-gray-500"
                          } transition-all duration-200`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Commentaire</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ajoutez un commentaire..."
                      className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none"
                      rows={4}
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-500">{error}</div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Envoi...' : 'Envoyer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingReview(false);
                        setRating(0);
                        setComment('');
                        setError('');
                      }}
                      className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Liste des avis */}
              <div className="mt-4 space-y-4">
                {(!movie.reviews || movie.reviews.length === 0) && 
                  <p className="text-gray-400">Aucun avis pour l'instant.</p>
                }
                
                {movie.reviews?.map((review, index) => (
                  <div key={review.id || index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-xl ${
                              star <= review.rating ? "text-yellow-400" : "text-gray-500"
                            }`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}