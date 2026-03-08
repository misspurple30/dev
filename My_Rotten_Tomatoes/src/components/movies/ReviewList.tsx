'use client';
import { useState } from 'react';
import { Review } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (reviewId: string) => Promise<void>;
  isAdmin?: boolean;
}

export default function ReviewList({ reviews: initialReviews, onDelete, isAdmin }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = async (reviewId: string) => {
    if (!onDelete) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      await onDelete(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-semibold">{review.userName}</span>
              <span className="text-gray-500 text-sm ml-2">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                  locale: fr
                })}
              </span>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          {isAdmin && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleDelete(review.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}