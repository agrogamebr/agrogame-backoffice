'use client';

import { ChevronDown, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface FilterOptions {
  documentType: string;
}

interface ProducerDataFilterProps {
  userId: string;
}

export function ProducerDataFilter({
  userId,
}: ProducerDataFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    documentType: searchParams.get('documentType') || '',
  });

  const hasActiveFilters = filters.documentType;

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/users/${userId}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({
      documentType: '',
    });
  };

  const handleReset = () => {
    handleClear();
    const params = new URLSearchParams(searchParams);
    params.delete('documentType');
    router.push(`/users/${userId}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-white hover:bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 flex items-center justify-between text-sm font-medium text-gray-700 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-4 z-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tipo de Documento
                </label>
                <select
                  value={filters.documentType}
                  onChange={(e) => handleFilterChange('documentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Todos</option>
                  <option value="cpf">CPF</option>
                  <option value="rg">RG</option>
                  <option value="cnh">CNH</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleReset}
                variant="ghost"
                className="flex-1 border-2 border-[#0B63E5] bg-white text-[#0B63E5] hover:bg-blue-50 font-medium py-2.5"
                disabled={!hasActiveFilters}
              >
                Limpar
              </Button>
              <Button
                onClick={handleApply}
                variant="primary"
                className="flex-1 bg-[#0B63E5] hover:bg-[#0951bd] font-medium py-2.5"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
