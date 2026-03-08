import ReviewList from '@/components/admin/ReviewList';
import { getAllReviews } from '@/lib/actions/admin';
import { MessageSquare } from 'lucide-react';

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <main className="min-h-screen bg-[#141414] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-[#E50914]" />
          <h1 className="text-2xl font-bold text-white">Avis ({reviews.length})</h1>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-6">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </main>
  );
}
