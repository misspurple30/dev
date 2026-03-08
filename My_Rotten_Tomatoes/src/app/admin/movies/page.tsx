import { getMovies } from '@/lib/actions/admin';
import MovieForm from '@/components/admin/MovieForm';
import MovieList from '@/components/admin/MovieList';
import { Film } from 'lucide-react';

export default async function AdminMoviesPage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen bg-[#141414] px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Film className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-2xl font-bold text-white">Films</h1>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Ajouter un film</h2>
          <MovieForm />
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Liste des films ({movies.length})</h2>
          <MovieList movies={movies} />
        </div>
      </div>
    </main>
  );
}
