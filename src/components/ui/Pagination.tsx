import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate the range of pages to show around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust range to show up to maxPagesToShow pages
    if (rangeEnd - rangeStart + 1 < Math.min(maxPagesToShow - 2, totalPages - 2)) {
      if (currentPage < totalPages / 2) {
        rangeEnd = Math.min(totalPages - 1, rangeStart + Math.min(maxPagesToShow - 3, totalPages - 3));
      } else {
        rangeStart = Math.max(2, rangeEnd - Math.min(maxPagesToShow - 3, totalPages - 3));
      }
    }
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }
    
    // Add pages in the calculated range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-md transition-colors",
          currentPage === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={cn(
                "min-w-[40px] h-10 px-3 rounded-md transition-colors",
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-md transition-colors",
          currentPage === totalPages
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        )}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};