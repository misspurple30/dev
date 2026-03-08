import { getServerSession } from 'next-auth/next';
import { notFound } from 'next/navigation';
import { getMovieDetails } from '@/lib/actions/movies';
import MovieDetails from '@/components/movies/MovieDetails';
import { authOptions } from '@/lib/auth';

interface Props {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: Props) {
  try {
    if (!params.id) {
      notFound();
    }

    const [session, movie] = await Promise.all([
      getServerSession(authOptions),
      getMovieDetails(params.id)
    ]);

    if (!movie) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <MovieDetails 
          movie={movie} 
          userSession={session}
        />
      </div>
    );
  } catch (error) {
    console.error('Erreur page détails:', error);
    notFound();
  }
}