'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaLink } from 'react-icons/fa';
import { Movie } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Heart, Star, Share2, X, Send, ArrowLeft } from 'lucide-react';

interface MovieDetailsProps {
  movie: Movie;
  userSession: Session | null;
}

export default function MovieDetails({ movie: initialMovie, userSession }: MovieDetailsProps) {
  const [movie, setMovie] = useState(initialMovie);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
    try {
      const response = await fetch(`/api/movies/${movie.tmdbId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setIsFavorite(!isFavorite);
      setMovie(prev => ({
        ...prev,
        favorites: data.isFavorite
          ? [...(prev.favorites || []), userSession.user.id]
          : prev.favorites.filter(id => id !== userSession.user.id),
      }));
      toast.success(data.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
    } catch {
      toast.error('Erreur lors de la modification des favoris');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      const newReview = { ...result.review, userName: userSession?.user.name || 'Utilisateur' };
      setMovie({ ...movie, reviews: [...(movie.reviews || []), newReview], averageRating: result.averageRating });
      setIsAddingReview(false);
      setRating(0);
      setComment('');
      toast.success('Avis ajouté !');
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Découvrez ${movie.title} sur MyRottenTomatoes!`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    switch (platform) {
      case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank'); break;
      case 'twitter': window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank'); break;
      case 'linkedin': window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank'); break;
      case 'whatsapp': window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank'); break;
      case 'copy':
        try { await navigator.clipboard.writeText(shareUrl); toast.success('Lien copié !'); }
        catch { toast.error('Erreur lors de la copie'); }
        break;
    }
  };

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Bouton retour */}
      <div className="absolute top-20 left-6 z-20">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm px-3 py-2 rounded transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>

      {/* Hero backdrop */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdropPath || movie.posterPath}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-gradient-bottom" />
      </div>

      <div className="container mx-auto px-6 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-48 md:w-64 mx-auto md:mx-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              width={256}
              height={384}
              className="rounded-lg shadow-2xl border border-[#333]"
              alt={movie.title}
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic text-sm mb-3">{movie.tagline}</p>}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-1 bg-[#E50914]/20 border border-[#E50914]/40 px-2 py-1 rounded">
                <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
                <span className="text-white font-semibold">{movie.averageRating?.toFixed(1) || 'N/A'}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span>{format(new Date(movie.releaseDate), 'd MMMM yyyy', { locale: fr })}</span>
              {movie.director && (
                <>
                  <span className="text-gray-500">•</span>
                  <span>Réal. <span className="text-white">{movie.director}</span></span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((genre) => (
                <span key={genre} className="genre-badge">{genre}</span>
              ))}
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {userSession && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded font-medium text-sm transition-colors ${
                    isFavorite
                      ? 'bg-[#E50914] text-white hover:bg-[#B20710]'
                      : 'border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>
              )}
            </div>

            {/* Partage */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Partager
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'facebook', icon: FaFacebook, color: '#1877f2' },
                  { key: 'twitter', icon: FaTwitter, color: '#1da1f2' },
                  { key: 'linkedin', icon: FaLinkedin, color: '#0a66c2' },
                  { key: 'whatsapp', icon: FaWhatsapp, color: '#25d366' },
                ].map(({ key, icon: Icon, color }) => (
                  <button key={key} onClick={() => handleShare(key)}
                    className="w-9 h-9 rounded flex items-center justify-center text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: color }}>
                    <Icon className="text-sm" />
                  </button>
                ))}
                <button onClick={() => handleShare('copy')}
                  className="w-9 h-9 rounded flex items-center justify-center bg-[#333] text-white hover:bg-[#444] transition-colors">
                  <FaLink className="text-sm" />
                </button>
              </div>
            </div>

            {/* Section Avis */}
            <div className="border-t border-[#2a2a2a] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                  Avis <span className="text-gray-400 font-normal text-sm">({movie.reviews?.length || 0})</span>
                </h3>
                {userSession && !isAddingReview && (
                  <button onClick={() => setIsAddingReview(true)}
                    className="btn-netflix text-sm px-4 py-2 rounded">
                    + Ajouter un avis
                  </button>
                )}
              </div>

              {/* Formulaire avis */}
              {userSession && isAddingReview && (
                <form onSubmit={handleSubmitReview} className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-5 mb-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm">Votre note</h4>
                    <button type="button" onClick={() => { setIsAddingReview(false); setRating(0); setComment(''); setError(''); }}
                      className="text-gray-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl transition-transform hover:scale-110">
                        <Star className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || rating) ? 'text-[#E50914] fill-[#E50914]' : 'text-[#444]'
                        }`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre avis sur ce film..."
                    className="input-netflix resize-none"
                    rows={3}
                    required
                  />

                  {error && <p className="text-[#E50914] text-xs">{error}</p>}

                  <div className="flex gap-3">
                    <button type="submit" disabled={isSubmitting || rating === 0}
                      className="btn-netflix flex items-center gap-2 px-5 py-2 rounded text-sm disabled:opacity-40">
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Envoi...' : 'Envoyer'}
                    </button>
                    <button type="button" onClick={() => { setIsAddingReview(false); setRating(0); setComment(''); setError(''); }}
                      className="border border-[#333] text-gray-400 hover:text-white px-5 py-2 rounded text-sm transition-colors">
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              {/* Liste avis */}
              <div className="space-y-3">
                {(!movie.reviews || movie.reviews.length === 0) && (
                  <p className="text-gray-500 text-sm italic">Aucun avis pour l'instant. Soyez le premier !</p>
                )}
                {movie.reviews?.map((review, index) => (
                  <div key={review.id || index} className="bg-[#181818] border border-[#2a2a2a] rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E50914] flex items-center justify-center text-white text-xs font-bold">
                          {review.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{review.userName}</p>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#E50914] fill-[#E50914]' : 'text-[#444]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed pl-9">{review.comment}</p>
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
