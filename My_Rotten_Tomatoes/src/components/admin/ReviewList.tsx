'use client';

import { useState } from 'react';
import { StarRating } from '@/components/common/StarRating';
import { deleteReview } from '@/lib/actions/admin';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  movieId: string;
  movieTitle: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews: initialReviews }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const router = useRouter();

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold">{review.movieTitle}</h3>
                <p className="text-sm text-gray-600">
                  Par {review.userName} • {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
            <div className="mb-2">
              <StarRating value={review.rating} readonly />
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}