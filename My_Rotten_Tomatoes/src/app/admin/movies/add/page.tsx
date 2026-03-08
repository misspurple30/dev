import MovieForm from '@/components/admin/MovieForm';
import { Film } from 'lucide-react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AddMoviePage() {
  return (
    <main className="min-h-screen bg-[#141414] px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/movies" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Retour aux films
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Film className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-2xl font-bold text-white">Ajouter un film</h1>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
          <MovieForm />
        </div>
      </div>
    </main>
  );
}
