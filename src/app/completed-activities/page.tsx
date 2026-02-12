import Link from 'next/link';
import { CompletedActivitiesTable } from '@/components/activities/CompletedActivitiesTable';
import { EmptyState } from '@/components/activities/EmptyState';
import { listActivitySubmissions, ActivitySubmission } from '@/services/activity-submissions.service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CompletedActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; size?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const size = Number(params?.size) || 10;

  let submissions: ActivitySubmission[] = [];
  let totalElements = 0;
  let totalPages = 0;

  try {
    const response = await listActivitySubmissions(page, size);
    submissions = response.submissions;
    totalElements = response.totalElements;
    totalPages = response.totalPages;
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number };
    if (
      error.message === 'Token JWT ausente ou inválido' ||
      error.message === 'Unauthorized' ||
      error.status === 401
    ) {
      const cookieStore = await cookies();
      cookieStore.delete('token');
      cookieStore.delete('user_info');
      redirect(
        `/login?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`
      );
    }
    console.error(error);
  }

  const hasSubmissions = submissions.length > 0;

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Atividades Realizadas
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {hasSubmissions ? (
          <CompletedActivitiesTable
            submissions={submissions}
            currentPage={page}
            pageSize={size}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center p-8">
            <EmptyState
              title="Sem atividades realizadas"
              description="Nenhuma atividade foi realizada pelos produtores ainda"
            />
          </div>
        )}
      </div>
    </div>
  );
}
