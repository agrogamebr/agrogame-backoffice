'use client';

import { MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export interface ProductionUnit {
  id: number;
  name: string;
  farmName: string;
  city: string;
}

interface ProductionUnitsTableProps {
  productionUnits: ProductionUnit[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export function ProductionUnitsTable({ 
  productionUnits, 
  currentPage, 
  pageSize, 
  totalElements, 
  totalPages 
}: ProductionUnitsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('unitsPage', page.toString());
    router.push(`/users/detail?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('unitsSize', size.toString());
    params.set('unitsPage', '0');
    router.push(`/users/detail?${params.toString()}`);
  };

  const handleViewProductionUnit = (unitId: number) => {
    // TODO: Implement production unit view functionality
    console.log('Visualizar unidade produtiva:', unitId);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const toggleMenu = (unitId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (openMenuId === unitId) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      
      // Calculate position - menu appears to the left of the button
      setMenuPosition({
        top: rect.bottom + 4, // 4px gap below button
        right: window.innerWidth - rect.right, // Align to right edge of button
      });
      
      setOpenMenuId(unitId);
    }
  };

  if (!productionUnits || productionUnits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
        <p className="text-center text-gray-500">Nenhuma unidade produtiva cadastrada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">NOME DA UNIDADE PRODUTIVA</TableHead>
            <TableHead className="w-[30%]">NOME DA FAZENDA</TableHead>
            <TableHead className="w-[25%]">CIDADE</TableHead>
            {/* <TableHead className="w-[10%] text-center">AÇÕES</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productionUnits.map((unit) => (
            <TableRow 
              key={unit.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <span className="text-sm font-medium text-gray-900">{unit.name}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                <span className="text-sm">{unit.farmName}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                <span className="text-sm">{unit.city}</span>
              </TableCell>
              {/* <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <Button
                      onClick={(e) => toggleMenu(unit.id, e)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {openMenuId === unit.id && menuPosition && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => {
                            setOpenMenuId(null);
                            setMenuPosition(null);
                          }}
                        />
                        <div
                          className="fixed z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-40"
                          style={{
                            top: `${menuPosition.top}px`,
                            right: `${menuPosition.right}px`,
                          }}
                        >
                          <button
                            onClick={() => handleViewProductionUnit(unit.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Visualizar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="px-6 py-4 border-t border-gray-100">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
