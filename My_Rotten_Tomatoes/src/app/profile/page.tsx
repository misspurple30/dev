import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getFavoriteMovies } from '@/lib/actions/movies';
import ProfileForm from '@/components/profile/ProfileForm';
import FavoriteMovieCard from '@/components/movies/FavoriteMovieCard';
import Pagination from '@/components/common/Pagination';
import Link from 'next/link';

interface ProfilePageProps {
  searchParams: {
    page?: string;
  };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { movies: favoriteMovies, pagination } = await getFavoriteMovies(session.user.id, page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">Mes informations</h2>
            <ProfileForm user={session.user} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Mes films favoris
              {pagination.total > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({pagination.total})
                </span>
              )}
            </h2>
            
            <div>
              {favoriteMovies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Vous n'avez pas encore de films favoris
                  </p>
                  <Link 
                    href="/movies" 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Ajouter des films à vos favoris
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-200">
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
                    <div className="mt-6">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}