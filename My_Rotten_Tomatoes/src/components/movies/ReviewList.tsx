'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Star } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (reviewId: string) => Promise<void>;
  isAdmin?: boolean;
}

export default function ReviewList({ reviews: initialReviews, onDelete, isAdmin }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = async (reviewId: string) => {
    if (!onDelete) return;
    if (confirm('Supprimer cet avis ?')) {
      await onDelete(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };

  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm italic">Aucun avis pour l'instant.</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Avatar initial */}
              <div className="w-8 h-8 rounded-full bg-[#E50914] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {review.userName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-white text-sm font-medium">{review.userName}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-[#E50914] fill-[#E50914]' : 'text-gray-600'}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}
              </span>
              {isAdmin && (
                <button onClick={() => handleDelete(review.id)} className="text-gray-600 hover:text-[#E50914] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed pl-11">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
