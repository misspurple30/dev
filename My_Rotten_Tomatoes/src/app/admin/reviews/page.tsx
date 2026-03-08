import ReviewList from '@/components/admin/ReviewList';
import { getAllReviews } from '@/lib/actions/admin';

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des avis</h1>
      <ReviewList reviews={reviews} />
    </div>
  );
}