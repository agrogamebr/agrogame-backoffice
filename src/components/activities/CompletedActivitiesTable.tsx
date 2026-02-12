'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { ActivitySubmission } from '@/services/activity-submissions.service';

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
                    <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {/* Points would come from activity, using placeholder */}
                      -
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
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar detalhes"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Desaprovar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
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

      {/* Details Modal - placeholder */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full m-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedSubmission.activityName}
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">PRODUTOR</p>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.producerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">FAZENDA</p>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.farmName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">STATUS</p>
                  <Badge variant={statusBadgeVariant[selectedSubmission.status] || 'rascunho'}>
                    {selectedSubmission.status === 'submitted' ? 'Pendente' : selectedSubmission.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">DATA</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedSubmission.submittedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3">ARQUIVOS</p>
                  <div className="space-y-2">
                    {selectedSubmission.files.map((file) => (
                      <a
                        key={file.fileId}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-blue-600 hover:underline text-sm">
                          {file.fileName}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
