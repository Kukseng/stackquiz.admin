import React from 'react';
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (totalPages <= 1) return null;

  return (
    <div className="border-t px-4 py-3 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
          <span className="font-medium">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> users
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = idx + 1;
          } else if (currentPage <= 3) {
            pageNum = idx + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + idx;
          } else {
            pageNum = currentPage - 2 + idx;
          }
          
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
