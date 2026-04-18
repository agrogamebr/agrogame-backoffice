'use client';

import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export interface Farm {
  id: number;
  name: string;
  statusLabel: string;
  city: string;
  state: string;
  cropTypes: string[];
  cropTypesSummary: string;
}

interface FarmsTableProps {
  farms: Farm[];
  userId: string;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

const statusBadgeVariant: Record<string, "enviado" | "pendente" | "excluida"> = {
  'ATIVA': 'enviado',
  'INATIVA': 'excluida',
  'PENDENTE': 'pendente',
};

export function FarmsTable({ farms, userId, currentPage, pageSize, totalElements, totalPages }: FarmsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('farmsPage', page.toString());
    router.push(`/users/${userId}?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('farmsSize', size.toString());
    params.set('farmsPage', '0');
    router.push(`/users/${userId}?${params.toString()}`);
  };

  const handleViewFarm = (farmId: number) => {
    // TODO: Implement farm view functionality
    console.log('Visualizar fazenda:', farmId);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const toggleMenu = (farmId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (openMenuId === farmId) {
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
      
      setOpenMenuId(farmId);
    }
  };

  const formatCropTypes = (cropTypes: string[]) => {
    if (!cropTypes || cropTypes.length === 0) {
      return '-';
    }
    return cropTypes.join(', ');
  };

  if (!farms || farms.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
        <p className="text-center text-gray-500">Nenhuma fazenda cadastrada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">STATUS</TableHead>
            <TableHead className="w-[25%]">NOME DA FAZENDA</TableHead>
            <TableHead className="w-[28%]">ATIVIDADES AGROPECUÁRIAS</TableHead>
            <TableHead className="w-[15%]">MUNICÍPIO</TableHead>
            <TableHead className="w-[10%]">UF</TableHead>
            {/* <TableHead className="w-[10%] text-center">AÇÕES</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {farms.map((farm) => (
            <TableRow 
              key={farm.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <Badge variant={statusBadgeVariant[farm.statusLabel] || 'pendente'}>
                  {farm.statusLabel}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-gray-900">{farm.name}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                <span className="text-sm">{formatCropTypes(farm.cropTypes)}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                <span className="text-sm">{farm.city}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                <span className="text-sm font-medium">{farm.state}</span>
              </TableCell>
              {/* <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <Button
                      onClick={(e) => toggleMenu(farm.id, e)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {openMenuId === farm.id && menuPosition && (
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
                            onClick={() => handleViewFarm(farm.id)}
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
