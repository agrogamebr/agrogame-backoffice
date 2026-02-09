'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}: PaginationProps) {
  const totalPages = Math.ceil(totalElements / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-end gap-6 px-6 py-4 bg-white border-t border-gray-100 rounded-b-lg">
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-sm text-gray-600">
          Resultados por página
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600">
        {totalElements > 0 ? (
          <span>
            {startItem}-{endItem} de {totalElements}
          </span>
        ) : (
          <span>0 de 0</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded transition-colors',
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
          )}
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages || totalPages === 0}
          className={cn(
            'p-2 rounded transition-colors',
            currentPage >= totalPages || totalPages === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
          )}
          title="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
