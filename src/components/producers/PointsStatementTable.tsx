'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

export interface PointsStatementItem {
  id: number;
  date: string;
  description: string;
  farmName: string;
  productionUnitName: string | null;
  operationType: string;
  points: number;
  balanceAfter: number;
}

interface PointsStatementTableProps {
  items: PointsStatementItem[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  userId: string;
}

export function PointsStatementTable({
  items,
  currentPage,
  pageSize,
  totalElements,
  totalPages,
  userId,
}: PointsStatementTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/users/${userId}/extrato?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    params.set('page', '0');
    router.push(`/users/${userId}/extrato?${params.toString()}`);
  };

  const getStatusBadge = (operationType: string) => {
    if (operationType === 'Crédito') {
      return (
        <Badge variant="enviado" className="w-22.5">
          Campanha
        </Badge>
      );
    }
    return (
      <Badge variant="excluida" className="w-22.5">
        Resgate
      </Badge>
    );
  };

  const getPointsDisplay = (points: number, operationType: string) => {
    const isCredit = operationType === 'Crédito';
    const Icon = isCredit ? TrendingDown : TrendingUp;
    const colorClass = isCredit ? 'text-[#34C759]' : 'text-[#C8272A]';
    
    return (
      <div className="flex items-center gap-1 justify-end">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className={`font-medium ${colorClass}`}>{points} pts</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">STATUS</TableHead>
            <TableHead className="w-[20%]">DESCRIÇÃO DO EVENTO</TableHead>
            <TableHead className="w-[18%]">FAZENDA</TableHead>
            <TableHead className="w-[18%]">UNIDADE DE PRODUÇÃO</TableHead>
            <TableHead className="w-[15%]">TIPO DE OPERAÇÃO</TableHead>
            <TableHead className="w-[12%] text-right">PONTOS</TableHead>
            <TableHead className="w-[7%] text-center">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow 
              key={`${item.id}-${index}`}
              className={item.operationType === 'Débito' ? 'border-l-4 border-l-[#C8272A]' : ''}
            >
              <TableCell>
                {getStatusBadge(item.operationType)}
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-gray-900">{item.description}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                {item.farmName}
              </TableCell>
              <TableCell className="text-gray-700">
                {item.productionUnitName || '-'}
              </TableCell>
              <TableCell className="text-gray-700">
                {item.operationType}
              </TableCell>
              <TableCell>
                {getPointsDisplay(item.points, item.operationType)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <button className="text-gray-600 hover:text-gray-900">
                    <span className="text-xl">⋮</span>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-t border-gray-100">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
