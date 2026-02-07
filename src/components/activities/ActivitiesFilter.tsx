import { ChevronDown, Filter } from 'lucide-react';

export function ActivitiesFilter() {
  return (
    <div className="relative w-full h-full">
      <button className="w-full h-full flex items-center justify-between px-4 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50 transition-colors gap-[4px]">
        <span className="text-sm font-medium">Filtros</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}
