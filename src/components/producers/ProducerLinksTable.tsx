'use client';

import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { approveProducerLinkAction } from '@/app/actions/producer-links';
import { useToast } from '@/components/ui/Toast';

export interface ProducerLink {
  userId: number;
  fullName: string;
  cpf: string | null;
  statusId: number;
  statusName: string;
  createdAt: string;
  updatedAt?: string | null;
  approvedByName?: string | null;
  rejectionReason?: string | null;
}

interface ProducerLinksTableProps {
  links: ProducerLink[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

const statusBadgeVariant: Record<string, "enviado" | "pendente" | "excluida"> = {
  'Aprovado': 'enviado',
  'Pendente': 'pendente',
  'Reprovado': 'excluida',
  'Rejeitado': 'excluida',
};

export function ProducerLinksTable({ 
  links, 
  currentPage, 
  pageSize, 
  totalElements, 
  totalPages 
}: ProducerLinksTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [isApproving, setIsApproving] = useState<number | null>(null);
  const [isRejecting, setIsRejecting] = useState<number | null>(null);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/vinculos?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    params.set('page', '0');
    router.push(`/vinculos?${params.toString()}`);
  };

  const handleApprove = async (linkUserId: number) => {
    setIsApproving(linkUserId);
    try {
      const result = await approveProducerLinkAction(linkUserId);
      
      if (result.success) {
        addToast(result.message || 'Vínculo aprovado com sucesso', 'success', 5000);
        router.refresh();
      } else {
        addToast(result.error || 'Erro ao aprovar vínculo', 'error', 5000);
      }
    } catch (error) {
      console.error('Erro ao aprovar vínculo:', error);
      addToast('Erro ao aprovar vínculo', 'error', 5000);
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = async (linkUserId: number) => {
    setIsRejecting(linkUserId);
    try {
      // TODO: Implementar chamada à API para reprovar
      console.log('Reprovando vínculo:', linkUserId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular chamada API
      router.refresh();
    } catch (error) {
      console.error('Erro ao reprovar vínculo:', error);
    } finally {
      setIsRejecting(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  if (!links || links.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
        <p className="text-center text-gray-500">Nenhum vínculo encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Nome do produtor rural</TableHead>
            <TableHead>Data da aprovação</TableHead>
            <TableHead>Aprovado/Reprovado por</TableHead>
            <TableHead>Motivo de reprovação</TableHead>
            <TableHead className="text-right">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => {
            const isPending = link.statusName === 'Pendente';
            const isApproved = link.statusName === 'Aprovado';
            const isRejected = link.statusName === 'Reprovado' || link.statusName === 'Rejeitado';
            
            return (
              <TableRow key={link.userId}>
                <TableCell>
                  <Badge variant={statusBadgeVariant[link.statusName] || 'pendente'}>
                    {link.statusName}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{link.fullName}</TableCell>
                <TableCell>
                  {isApproved || isRejected ? formatDate(link.updatedAt) : '-'}
                </TableCell>
                <TableCell>
                  {isApproved || isRejected ? (link.approvedByName || '-') : '-'}
                </TableCell>
                <TableCell>
                  {isRejected && link.rejectionReason ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">💬</span>
                      <span className="text-gray-700">{link.rejectionReason}</span>
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isPending ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 h-auto text-sm font-medium"
                        onClick={() => handleApprove(link.userId)}
                        disabled={isApproving === link.userId}
                      >
                        {isApproving === link.userId ? 'Aprovando...' : 'Aprovar'}
                      </Button>
                      <span className="text-gray-300">|</span>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 h-auto text-sm font-medium"
                        onClick={() => handleReject(link.userId)}
                        disabled={isRejecting === link.userId}
                      >
                        {isRejecting === link.userId ? 'Reprovando...' : 'Reprovar'}
                      </Button>
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-gray-100">
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
