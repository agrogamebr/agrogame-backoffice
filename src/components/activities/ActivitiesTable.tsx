
'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ConfirmModal';
import { cancelActivity } from '@/app/actions/activity';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export type ActivityStatus = 'Enviado' | 'Rascunho' | 'Excluída' | 'Completado' | 'Cancelado';
export type ActivityStatusCode = 'draft' | 'send' | 'deleted' | 'completed' | 'canceled';

export interface Activity {
  id: string;
  name: string;
  status: ActivityStatus;
  statusCode: ActivityStatusCode;
  points: number;
  createdAt: string;
  rowKey: string;
}

interface ActivitiesTableProps {
  activities: Activity[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
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
  totalPages,
}: ActivitiesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activityToCancel, setActivityToCancel] = useState<Activity | null>(null);
  const [isCancelling, startCancelTransition] = useTransition();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/activities?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', size.toString());
    params.set('page', '0');
    router.push(`/activities?${params.toString()}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/activities/create?id=${id}`);
  };

  const handleCancelClick = (activity: Activity) => {
    setActivityToCancel(activity);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!activityToCancel) return;

    startCancelTransition(async () => {
      try {
        await cancelActivity(activityToCancel.id);
        setIsConfirmOpen(false);
        setActivityToCancel(null);
        router.refresh();
      } catch (error) {
        console.error('Failed to cancel activity', error);
        setIsConfirmOpen(false);
        setActivityToCancel(null);
      }
    });
  };

  const handleSend = (id: string) => {
    console.log('Send', id);
    // TODO: Implement send logic
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const showSendButton = (statusCode: ActivityStatusCode) => {
    return statusCode !== 'send' && statusCode !== 'completed' && statusCode !== 'canceled';
  };

  const showCancelButton = (statusCode: ActivityStatusCode) => {
    return statusCode === 'draft';
  };

  const showEditButton = (statusCode: ActivityStatusCode) => {
    return statusCode !== 'canceled';
  }

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
            <TableRow key={activity.rowKey}>
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
                  {showEditButton(activity.statusCode) && (
                    <Button
                      onClick={() => handleEdit(activity.id)}
                      variant="ghost"
                      size="icon"
                      className="hover:scale-110"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4 text-[#0B63E5]" />
                    </Button>
                  )}

                  {showCancelButton(activity.statusCode) && (
                    <Button
                      onClick={() => handleCancelClick(activity)}
                      variant="ghost"
                      size="icon"
                      className="hover:scale-110"
                      title="Cancelar"
                    >
                      <Trash2 className="w-4 h-4 text-[#FF383C]" />
                    </Button>
                  )}

                  {showSendButton(activity.statusCode) && (
                    <Button
                      onClick={() => handleSend(activity.id)}
                      variant="ghost"
                      size="icon"
                      className="hover:scale-110"
                      title="Enviar"
                    >
                      <Send className="w-4 h-4 text-[#00C448]" />
                    </Button>
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
        totalPages={totalPages}
        hasActivitiesOnPage={activities.length > 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Cancelar atividade"
        description={activityToCancel ? `Deseja cancelar a atividade "${activityToCancel.name}"?` : 'Deseja cancelar esta atividade?'}
        confirmLabel="Sim"
        cancelLabel="Não"
        isConfirming={isCancelling}
        onClose={() => {
          if (!isCancelling) {
            setIsConfirmOpen(false);
            setActivityToCancel(null);
          }
        }}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
}
