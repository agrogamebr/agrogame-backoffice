'use client';

import { ChevronDown, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOptions {
  status: string;
  cropTypeId: string;
  farmId: string;
  productionUnitId: string;
  startDate: string;
  endDate: string;
}

interface DropdownOption {
  id: number;
  name: string;
}

export function ActivitiesFilter({
  cropTypes = [],
  farms = [],
  productionUnits = [],
}: {
  cropTypes?: DropdownOption[];
  farms?: DropdownOption[];
  productionUnits?: DropdownOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    status: searchParams.get('status') || '',
    cropTypeId: searchParams.get('cropTypeId') || '',
    farmId: searchParams.get('farmId') || '',
    productionUnitId: searchParams.get('productionUnitId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    params.set('page', '0');

    router.push(`/activities?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      cropTypeId: '',
      farmId: '',
      productionUnitId: '',
      startDate: '',
      endDate: '',
    });
    router.push('/activities?page=0');
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="relative w-full h-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full flex items-center justify-between px-4 rounded-lg border transition-all gap-2 cursor-pointer font-medium text-sm ${
          hasActiveFilters
            ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filtrar atividades</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="send">Enviado</option>
                <option value="completed">Completado</option>
                <option value="canceled">Cancelado</option>
                <option value="deleted">Excluída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultura
              </label>
              <select
                value={filters.cropTypeId}
                onChange={(e) => handleFilterChange('cropTypeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Todas as culturas</option>
                {cropTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fazenda
              </label>
              <select
                value={filters.farmId}
                onChange={(e) => handleFilterChange('farmId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Todas as fazendas</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade Produtiva
              </label>
              <select
                value={filters.productionUnitId}
                onChange={(e) => handleFilterChange('productionUnitId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900"
              >
                <option value="">Todas as unidades produtivas</option>
                {productionUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de início
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de fim
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900"
              />
            </div> */}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Limpar filtros
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-[#0B63E5] text-white rounded-lg font-medium hover:bg-[#0951bd] transition-colors"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
