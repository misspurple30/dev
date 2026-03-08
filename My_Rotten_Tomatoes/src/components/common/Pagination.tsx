'use client';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/movies" }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        Précédent
      </button>
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNumber;
        if (totalPages <= 5) {
          pageNumber = i + 1;
        } else if (currentPage <= 3) {
          pageNumber = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNumber = totalPages - 4 + i;
        } else {
          pageNumber = currentPage - 2 + i;
        }

        return (
          <button
            key={i}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 border rounded-md ${
              currentPage === pageNumber
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
}