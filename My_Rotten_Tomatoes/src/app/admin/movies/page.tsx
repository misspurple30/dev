import { getMovies } from '@/lib/actions/admin';
import MovieForm from '@/components/admin/MovieForm';
import MovieList from '@/components/admin/MovieList';

export default async function AdminMoviesPage() {
  const movies = await getMovies();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des films</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau film</h2>
        <MovieForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Liste des films</h2>
        <MovieList movies={movies} />
      </div>
    </div>
  );
}