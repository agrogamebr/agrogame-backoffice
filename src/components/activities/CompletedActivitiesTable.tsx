'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { ActivitySubmission } from '@/services/activity-submissions.service';
import { ActivityDecisionModal } from './ActivityDecisionModal';
import { Button } from '@/components/ui/Button';

interface CompletedActivitiesTableProps {
  submissions: ActivitySubmission[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

const statusBadgeVariant: Record<string, "pendente" | "rascunho" | "excluida" | "aprovado" | "rejeitado"> = {
  'submitted': 'pendente',
  'approved': 'aprovado',
  'rejected': 'rejeitado',
};

export function CompletedActivitiesTable({
  submissions,
  currentPage,
  pageSize,
  totalElements,
  totalPages,
}: CompletedActivitiesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/completed-activities?${params.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('size', newSize.toString());
    params.set('page', '0');
    router.push(`/completed-activities?${params.toString()}`);
  };

  const handleOpenModal = (submission: ActivitySubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selection to avoid content flash during ease-out (if animated)
    setTimeout(() => setSelectedSubmission(null), 200);
  };

  const handleSaveStatus = () => {
    router.refresh();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NOME DA ATIVIDADE</TableHead>
              <TableHead>NOME DO PRODUTOR</TableHead>
              <TableHead className="text-center">PONTOS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-center">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.userActivityId}>
                <TableCell className="font-medium text-gray-900">
                  {submission.activityName}
                </TableCell>
                <TableCell className="text-gray-700">
                  {submission.producerName}
                </TableCell>
                <TableCell className="text-center text-gray-700">
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#0B63E5] px-3 py-1 rounded-full">
                      {submission.points}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[submission.status] || 'rascunho'}>
                    {submission.status === 'submitted' ? 'Pendente' : submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      onClick={() => handleOpenModal(submission)}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-50"
                      title="Visualizar detalhes"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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

      {selectedSubmission && (
        <ActivityDecisionModal
          submission={selectedSubmission}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
}
