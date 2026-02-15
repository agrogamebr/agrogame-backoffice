'use client';

import { ChevronDown, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductionUnitResponse } from '@/services/activity-create.service';
import { getProductionUnitsAction } from '@/app/actions/production-units';
import { Button } from '@/components/ui/Button';

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
  productionUnits?: DropdownOption[]; // Initial list, likely empty if dependent on farms
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

  const [availableProductionUnits, setAvailableProductionUnits] = useState<DropdownOption[]>(productionUnits);
  const [loadingProductionUnits, setLoadingProductionUnits] = useState(false);

  useEffect(() => {
    async function fetchUnits() {
      // Logic:
      // If a farm is selected, we fetch units for that farm (and optionally filtered by crop if selected)
      // If no farm is selected, we can show all units OR show none/disabled. 
      // Requirement: "unidades produtivas carregadas devem depender da(s) fazenda(s) selecionada(s)"
      // And "sempre que a fazenda selecionada alterar, o sistema precisa tentar buscar as unidades produtivas desta fazenda"

      if (!filters.farmId) {
        // If no farm is selected, we might want to show all initially loaded units or clear them.
        // Assuming we fall back to the initial list passed via props if provided, or empty.
        // But per requirement, it strongly suggests dependency. Let's see if we should clear it.
        // If the initial page load has a farmId in URL, we want to fetch.

        // If we are strictly following "depend on selected farm", then no farm = no specific units or all.
        // But usually "All farms" means all units. However, fetching ALL units might be heavy if not paginated.
        // Let's stick to: If farm is selected, filter. If not, maybe showing all passed from props (which might be all).
        setAvailableProductionUnits(productionUnits);
        return;
      }

      setLoadingProductionUnits(true);
      try {
        const farmIds = [parseInt(filters.farmId, 10)];
        const cropTypeIds = filters.cropTypeId ? [parseInt(filters.cropTypeId, 10)] : [];


        // ...

        // inside useEffect
        const response = await getProductionUnitsAction(farmIds, cropTypeIds);

        if (response.success && response.data) {
          const units = response.data;
          setAvailableProductionUnits(units.map((u: ProductionUnitResponse) => ({ id: u.id, name: u.name })));

          // If the currently selected production unit is not in the new list, clear it
          if (filters.productionUnitId) {
            const exists = units.some((u: ProductionUnitResponse) => u.id === parseInt(filters.productionUnitId, 10));
            if (!exists) {
              setFilters(prev => ({ ...prev, productionUnitId: '' }));
            }
          }
        } else {
          console.error('Failed to fetch production units:', response.error);
          setAvailableProductionUnits([]);
        }
      } catch (error) {
        console.error('Failed to fetch production units:', error);
        setAvailableProductionUnits([]);
      } finally {
        setLoadingProductionUnits(false);
      }
    }

    fetchUnits();
  }, [filters.farmId, filters.cropTypeId, productionUnits]);


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
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant={hasActiveFilters ? "ghost" : "ghost"}
        className={`w-full h-full justify-between px-4 rounded-lg border gap-2 font-medium text-sm ${hasActiveFilters
          ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

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
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="p-1 h-auto"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
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
                disabled={loadingProductionUnits}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B63E5] focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">
                  {loadingProductionUnits ? 'Carregando...' : 'Todas as unidades produtivas'}
                </option>
                {availableProductionUnits.map((unit) => (
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
            <Button
              onClick={handleClearFilters}
              variant="secondary"
              className="flex-1 border border-gray-300"
            >
              Limpar filtros
            </Button>
            <Button
              onClick={handleApplyFilters}
              variant="primary"
              className="flex-1 bg-[#0B63E5] hover:bg-[#0951bd]"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
