'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 bg-[#181818] border border-[#333] text-gray-400 hover:text-white hover:border-[#E50914] rounded transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-600 px-1">…</span>}
            <button
              onClick={() => goTo(page)}
              className={`w-9 h-9 rounded text-sm font-medium transition ${
                page === currentPage
                  ? 'bg-[#E50914] text-white'
                  : 'bg-[#181818] border border-[#333] text-gray-400 hover:text-white hover:border-[#E50914]'
              }`}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 bg-[#181818] border border-[#333] text-gray-400 hover:text-white hover:border-[#E50914] rounded transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
