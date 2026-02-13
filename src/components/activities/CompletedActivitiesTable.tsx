'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, Trash2, FileText, File } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { ActivitySubmission, SubmissionFile } from '@/services/activity-submissions.service';
import { getFileUrl, isImageFile, getFileExtension } from '@/lib/file-utils';

interface FilePreviewProps {
  file: SubmissionFile;
  className?: string;
}

const FilePreview = ({ file, className = '' }: FilePreviewProps) => {
  const isImage = isImageFile(file.fileName);
  const fileUrl = getFileUrl(file.gsutilUri);

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={file.fileName}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.onerror = null;
          target.style.display = 'none';
          target.parentElement?.classList.add('bg-gray-100', 'flex', 'items-center', 'justify-center');
          if (target.parentElement) {
            target.parentElement.innerHTML = '<span class="text-xs text-red-400">Erro</span>';
          }
        }}
      />
    );
  }

  const extension = getFileExtension(file.fileName);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-50 ${className}`}>
      <FileText className="w-8 h-8 text-gray-400 mb-1" />
      <span className="text-xs font-medium text-gray-500">{extension}</span>
    </div>
  );
};

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
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [justification, setJustification] = useState<string>('');

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
    setSelectedStatus(submission.status);
    setJustification('');
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
    setSelectedStatus('');
    setJustification('');
  };

  const handleSaveStatus = async () => {
    if (!selectedSubmission) return;

    console.log('Saving status update:', {
      userActivityId: selectedSubmission.userActivityId,
      status: selectedStatus,
      justification,
    });

    // TODO: Implement API call to update status
    // await updateSubmissionStatus(selectedSubmission.userActivityId, selectedStatus, justification);

    handleCloseModal();
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
                    <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
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
                      onClick={() => handleOpenModal(submission)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Visualizar detalhes"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
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

      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Atividade | {selectedSubmission.activityName}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <Badge variant="fazenda">
                  Fazenda {selectedSubmission.farmName}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-normal mb-2 leading-none tracking-[0.02em] font-sans">
                  Descrição da atividade
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Campo ausente
                </p>
              </div>

              {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                <div>
                  <h3 className="text-sm font-normal mb-3 leading-none tracking-[0.02em] font-sans">
                    Registro de atividades do usuário
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedSubmission.files.slice(0, 6).map((file) => (
                      <a
                        key={file.fileId}
                        href={getFileUrl(file.gsutilUri)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                        title={file.fileName}
                      >
                        <FilePreview file={file} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-normal mb-2 leading-none tracking-[0.02em] font-sans">
                    Status da atividade
                  </label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="submitted" disabled={selectedSubmission.status !== 'submitted'}>
                      Pendente
                    </option>
                    <option value="approved">
                      Aprovado
                    </option>
                    <option value="rejected">
                      Rejeitado
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="justification" className="block text-sm font-normal mb-2 leading-none tracking-[0.02em] font-sans">
                    Justificativa
                  </label>
                  <textarea
                    id="justification"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-[80px] bg-white text-gray-900"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0B63E5] rounded-md hover:bg-[#0951bd] transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
