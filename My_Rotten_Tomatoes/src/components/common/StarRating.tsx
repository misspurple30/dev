'use client';

interface StarRatingProps {
  value: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, readonly = false, onChange, size = 'md' }: StarRatingProps) {
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starSize = starSizes[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          className={`${starSize} ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          {star <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}