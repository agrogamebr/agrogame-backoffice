'use client';

import { useMemo, useState, useEffect, useRef } from 'react';

export interface SelectableCheckboxItem {
  id: number;
  label: string;
}

interface SelectableCheckboxListProps {
  title: string | React.ReactNode;
  filterPlaceholder: string;
  items: SelectableCheckboxItem[];
  inputName: string;
  defaultSelectedIds?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
}

export function SelectableCheckboxList({
  title,
  filterPlaceholder,
  items,
  inputName,
  defaultSelectedIds = [],
  onSelectionChange,
}: SelectableCheckboxListProps) {
  const [filter, setFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => {
      if (defaultSelectedIds && defaultSelectedIds.length > 0) {
        return new Set(defaultSelectedIds);
      }
      return new Set();
    }
  );
  
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedIds));
    }
  }, [selectedIds, onSelectionChange]);

  const filteredItems = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [filter, items]);

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;

  const handleToggleAll = () => {
    setSelectedIds((current) => {
      if (current.size === items.length) {
        return new Set();
      } else {
        return new Set(items.map((item) => item.id));
      }
    });
  };

  const handleToggleItem = (id: number) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <input
          type="text"
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
        />
      </div>
      <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleToggleAll}
            className="h-4 w-4 rounded border-gray-300 text-[#0B63E5] focus:ring-[#0B63E5]"
          />
          <span className="font-semibold text-gray-800">
            {isAllSelected ? 'Desmarcar todos' : 'Selecionar todos'} ({items.length})
          </span>
        </label>
        {filteredItems.map((item) => (
          <label key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              name={inputName}
              value={item.id}
              checked={selectedIds.has(item.id)}
              onChange={() => handleToggleItem(item.id)}
              className="h-4 w-4 rounded border-gray-300 text-[#0B63E5] focus:ring-[#0B63E5]"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
