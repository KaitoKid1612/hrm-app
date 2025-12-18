import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = Math.min(maxPageNumbers, totalPages);

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 h-10"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Trước</span>
      </Button>

      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className={`w-10 h-10 p-0 ${
                currentPage === pageNum
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  : ''
              }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 h-10"
      >
        <span className="hidden sm:inline">Sau</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
