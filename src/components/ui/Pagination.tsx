import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/helpers';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Logic to show a window of pages can be added here if totalPages is large
  // For now, simple list suitable for moderate page counts

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-1">
        {pages.map((page) => {
             // Simple windowing logic: show first, last, current, and neighbors
             if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
             ) {
                 return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                        currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        )}
                    >
                        {page}
                    </button>
                 );
             } else if (
                 (page === currentPage - 2 && currentPage > 3) ||
                 (page === currentPage + 2 && currentPage < totalPages - 2)
             ) {
                 return <span key={page} className="text-gray-400 px-1">...</span>;
             }
             return null;
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
