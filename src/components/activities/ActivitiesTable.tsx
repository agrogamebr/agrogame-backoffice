'use client';

import { Pencil, Trash2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

export type ActivityStatus = 'Enviado' | 'Rascunho' | 'Excluída' | 'Completado' | 'Cancelado';

export interface Activity {
  id: string;
  name: string;
  status: ActivityStatus;
  points: number;
  createdAt: string;
}

interface ActivitiesTableProps {
  activities: Activity[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
}

const statusBadgeVariant: Record<ActivityStatus, "enviado" | "rascunho" | "excluida" | "completado" | "cancelado"> = {
  'Enviado': 'enviado',
  'Rascunho': 'rascunho',
  'Excluída': 'excluida',
  'Completado': 'completado',
  'Cancelado': 'cancelado',
};

export function ActivitiesTable({
  activities,
  currentPage,
  pageSize,
  totalElements,
}: ActivitiesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/activities?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    params.set('page', '1');
    router.push(`/activities?${params.toString()}`);
  };

  const handleEdit = (id: string) => {
    console.log('Edit', id);
    // TODO: Implement navigation or modal logic
  };

  const handleDelete = (id: string) => {
    console.log('Delete', id);
    // TODO: Implement delete logic (maybe modal confirmation then Server Action)
  };

  const handleSend = (id: string) => {
    console.log('Send', id);
    // TODO: Implement send logic
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const showSendButton = (status: ActivityStatus) => {
    return status !== 'Enviado' && status !== 'Completado';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">STATUS</TableHead>
            <TableHead>NOME DA ATIVIDADE</TableHead>
            <TableHead className="w-25 text-center">PONTOS</TableHead>
            <TableHead className="w-32.5">DATA DA CRIAÇÃO</TableHead>
            <TableHead className="w-25 text-center">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                <Badge variant={statusBadgeVariant[activity.status]}>
                  {activity.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-gray-900">{activity.name}</span>
              </TableCell>
              <TableCell className="text-center text-gray-700">
                {activity.points}pts
              </TableCell>
              <TableCell className="text-gray-700">
                {formatDate(activity.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(activity.id)}
                    className="p-2 transition-transform hover:scale-110 cursor-pointer"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4 text-[#0B63E5]" />
                  </button>

                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-2 transition-transform hover:scale-110 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-[#FF383C]" />
                  </button>

                  {showSendButton(activity.status) && (
                    <button
                      onClick={() => handleSend(activity.id)}
                      className="p-2 transition-transform hover:scale-110 cursor-pointer"
                      title="Enviar"
                    >
                      <Send className="w-4 h-4 text-[#00C448]" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalElements={totalElements}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
