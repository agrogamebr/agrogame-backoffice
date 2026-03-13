'use client';

import { ChevronDown, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface FilterOptions {
  name: string;
  cpf: string;
  statusId: string;
}

export function ProducersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    name: searchParams.get('name') || '',
    cpf: searchParams.get('cpf') || '',
    statusId: searchParams.get('statusId') || '',
  });

  const hasActiveFilters = filters.name || filters.cpf || filters.statusId;

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    
    // Reset to first page when applying filters
    params.set('page', '0');
    
    // Update or remove filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/users?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({
      name: '',
      cpf: '',
      statusId: '',
    });
  };

  const handleReset = () => {
    handleClear();
    const params = new URLSearchParams(searchParams);
    params.delete('name');
    params.delete('cpf');
    params.delete('statusId');
    params.set('page', '0');
    router.push(`/users?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-white hover:bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 flex items-center justify-between text-sm font-medium text-gray-700 transition-colors"
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
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nome
                </label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="Buscar por nome"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  CPF
                </label>
                <input
                  type="text"
                  value={filters.cpf}
                  onChange={(e) => handleFilterChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status do Cadastro
                </label>
                <select
                  value={filters.statusId}
                  onChange={(e) => handleFilterChange('statusId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Todos</option>
                  <option value="1">Aprovado</option>
                  <option value="3">Pendente</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex-1"
                disabled={!hasActiveFilters}
              >
                Limpar
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 bg-[#0B63E5] hover:bg-[#0951bd] text-white"
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
