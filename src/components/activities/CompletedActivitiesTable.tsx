'use client';

import { useState, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { ActivitySubmission } from '@/services/activity-submissions.service';
import { ActivityDecisionModal } from './ActivityDecisionModal';
import { Button } from '@/components/ui/Button';
import { getActivityDetailsAction, ActivityReview } from '@/app/actions/activity-decision';

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

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

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
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [reviewsData, setReviewsData] = useState<Record<number, ActivityReview[]>>({});
  const [loadingReviews, setLoadingReviews] = useState<Set<number>>(new Set());

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

  const toggleRow = async (userActivityId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newExpandedRows = new Set(expandedRows);
    
    if (expandedRows.has(userActivityId)) {
      // Collapse the row
      newExpandedRows.delete(userActivityId);
      setExpandedRows(newExpandedRows);
    } else {
      // Expand the row
      newExpandedRows.add(userActivityId);
      setExpandedRows(newExpandedRows);

      // Fetch reviews if not already fetched
      if (!reviewsData[userActivityId]) {
        setLoadingReviews(new Set(loadingReviews).add(userActivityId));
        
        try {
          console.log('🔄 [CompletedActivitiesTable] Buscando reviews para userActivityId:', userActivityId);
          const result = await getActivityDetailsAction(userActivityId);
          console.log('📥 [CompletedActivitiesTable] Resultado recebido:', result);
          
          if (result.success && result.data) {
            console.log('✅ [CompletedActivitiesTable] Reviews encontradas:', result.data.reviews);
            setReviewsData({
              ...reviewsData,
              [userActivityId]: result.data.reviews,
            });
          } else {
            console.error('❌ [CompletedActivitiesTable] Erro ao buscar revisões:', result.error);
            // Remove from expanded on error
            newExpandedRows.delete(userActivityId);
            setExpandedRows(newExpandedRows);
          }
        } catch (error) {
          console.error('❌ [CompletedActivitiesTable] Exceção ao buscar revisões:', error);
          // Remove from expanded on error
          newExpandedRows.delete(userActivityId);
          setExpandedRows(newExpandedRows);
        } finally {
          const newLoadingReviews = new Set(loadingReviews);
          newLoadingReviews.delete(userActivityId);
          setLoadingReviews(newLoadingReviews);
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">HISTÓRICO DE REVISÕES</TableHead>
              <TableHead className="whitespace-nowrap">NOME DA ATIVIDADE</TableHead>
              <TableHead className="whitespace-nowrap">NOME DO PRODUTOR</TableHead>
              <TableHead className="text-center whitespace-nowrap">PONTOS</TableHead>
              <TableHead className="whitespace-nowrap">STATUS</TableHead>
              <TableHead className="text-center whitespace-nowrap">AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => {
              const isExpanded = expandedRows.has(submission.userActivityId);
              const isLoading = loadingReviews.has(submission.userActivityId);
              const reviews = reviewsData[submission.userActivityId] || [];

              return (
                <Fragment key={submission.userActivityId}>
                  <TableRow
                    onClick={() => handleOpenModal(submission)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Button
                        onClick={(e) => toggleRow(submission.userActivityId, e)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 hover:bg-gray-200"
                        title={isExpanded ? "Recolher" : "Expandir histórico"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                      </Button>
                    </TableCell>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(submission);
                          }}
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

                  {/* Sub-table row for reviews */}
                  {isExpanded && (
                    <TableRow key={`${submission.userActivityId}-reviews`} className="bg-gray-50">
                      <TableCell colSpan={6} className="p-0">
                        <div className="px-14 py-4">
                          {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                              <span className="ml-2 text-sm text-gray-600">Carregando histórico...</span>
                            </div>
                          ) : reviews.length > 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700">Histórico de Revisões</h4>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Revisado por
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Observações
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Revisado em
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {reviews.map((review) => (
                                      <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">
                                          <Badge 
                                            variant={
                                              review.statusCode === 'approved' ? 'aprovado' : 
                                              review.statusCode === 'rejected' ? 'rejeitado' : 
                                              'pendente'
                                            }
                                          >
                                            {review.statusName}
                                          </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                          {review.reviewerName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                          {review.notes || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                          {formatDate(review.reviewedAt)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-500">Nenhuma revisão encontrada</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
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
