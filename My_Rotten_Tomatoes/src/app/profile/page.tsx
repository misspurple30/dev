import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getFavoriteMovies } from '@/lib/actions/movies';
import ProfileForm from '@/components/profile/ProfileForm';
import FavoriteMovieCard from '@/components/movies/FavoriteMovieCard';
import Pagination from '@/components/common/Pagination';
import Link from 'next/link';
import { Heart, User } from 'lucide-react';

interface ProfilePageProps {
  searchParams: Promise<{ page?: string }> | { page?: string };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login');

  const params = await Promise.resolve(searchParams);
  const page = params.page ? parseInt(params.page) : 1;
  const { movies: favoriteMovies, pagination } = await getFavoriteMovies(session.user.id, page);

  return (
    <main className="min-h-screen bg-[#141414] pt-24 pb-16">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Mon Profil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire profil */}
          <div className="lg:col-span-2">
            <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center text-white font-bold text-lg">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{session.user.name}</p>
                  <p className="text-gray-400 text-sm">{session.user.email}</p>
                </div>
              </div>
              <ProfileForm user={session.user} />
            </div>
          </div>

          {/* Favoris */}
          <div>
            <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5">
                <Heart className="w-5 h-5 text-[#E50914] fill-[#E50914]" />
                <h2 className="text-white font-semibold">
                  Mes favoris
                  {pagination.total > 0 && (
                    <span className="text-gray-400 font-normal text-sm ml-2">({pagination.total})</span>
                  )}
                </h2>
              </div>

              {favoriteMovies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-3">Aucun film favori pour l'instant</p>
                  <Link href="/movies" className="btn-netflix text-sm px-4 py-2 rounded inline-block">
                    Découvrir des films
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {favoriteMovies.map((movie) => (
                      <FavoriteMovieCard
                        key={movie._id}
                        tmdbId={movie.tmdbId}
                        title={movie.title}
                        posterPath={movie.posterPath}
                        rating={movie.averageRating}
                      />
                    ))}
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
