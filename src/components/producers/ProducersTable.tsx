'use client';

import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { maskCpf } from '@/lib/utils';
import { useState } from 'react';
import { ProducerStatusDisplay, ProducerStatusCode } from '@/types/producer-status';

export type ProducerStatus = ProducerStatusDisplay;

export interface Producer {
  userId: number;
  name: string;
  cpf: string;
  status: ProducerStatus;
  statusCode: ProducerStatusCode;
  createdAt: string;
}

interface ProducersTableProps {
  producers: Producer[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

const statusBadgeVariant: Record<ProducerStatus, "enviado" | "rascunho" | "excluida"> = {
  'Aprovado': 'enviado',
  'Ativo': 'enviado',
  'Pendente': 'rascunho',
  'Rejeitado': 'excluida',
  'Inativo': 'excluida',
  'Suspenso': 'rascunho',
};

export function ProducersTable({
  producers,
  currentPage,
  pageSize,
  totalElements,
  totalPages,
}: ProducersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/users?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    params.set('page', '0');
    router.push(`/users?${params.toString()}`);
  };

  const handleViewProfile = (userId: number) => {
    // TODO: Navigate to AGRO-241 when implemented
    router.push(`/users/${userId}`);
  };

  const handleManageProducer = (userId: number, userName: string, status: ProducerStatus) => {
    router.push(`/users/${userId}?name=${encodeURIComponent(userName)}&status=${status}`);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleViewPointsStatement = (userId: number, userName: string) => {
    router.push(`/users/${userId}/extrato?name=${encodeURIComponent(userName)}`);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const toggleMenu = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (openMenuId === userId) {
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
      
      setOpenMenuId(userId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">USER ID</TableHead>
            <TableHead className="w-[28%]">NOME COMPLETO</TableHead>
            <TableHead className="w-[18%]">CPF</TableHead>
            <TableHead className="w-[14%]">STATUS</TableHead>
            <TableHead className="w-[18%]">DATA DE CRIAÇÃO</TableHead>
            <TableHead className="w-[10%] text-center">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {producers.map((producer) => (
            <TableRow 
              key={producer.userId}
              onClick={() => handleViewProfile(producer.userId)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <span className="text-sm font-medium text-gray-900">#{producer.userId}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-gray-900">{producer.name}</span>
              </TableCell>
              <TableCell className="text-gray-700">
                {maskCpf(producer.cpf)}
              </TableCell>
              <TableCell>
                <Badge variant={statusBadgeVariant[producer.status]}>
                  {producer.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">
                {formatDate(producer.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <Button
                      onClick={(e) => toggleMenu(producer.userId, e)}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      title="Ações"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </Button>

                    {openMenuId === producer.userId && menuPosition && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            setMenuPosition(null);
                          }}
                        />
                        <div 
                          className="fixed w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                          style={{
                            top: `${menuPosition.top}px`,
                            right: `${menuPosition.right}px`,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleManageProducer(producer.userId, producer.name, producer.status);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <span>Gerenciar dados do produtor</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPointsStatement(producer.userId, producer.name);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <span>Ver extrato de pontos</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TableCell>
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
