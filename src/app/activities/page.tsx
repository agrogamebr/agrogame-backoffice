import { Button } from '@/components/ui/Button';
import { ActivitiesFilter } from '@/components/activities/ActivitiesFilter';
import { EmptyState } from '@/components/activities/EmptyState';
import { ActivitiesTable, Activity, ActivityStatus } from '@/components/activities/ActivitiesTable';
import { listActivities } from '@/services/activity.service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const statusMapping: Record<string, ActivityStatus> = {
  'draft': 'Rascunho',
  'send': 'Enviado',
  'deleted': 'Excluída',
  'completed': 'Completado',
  'canceled': 'Cancelado',
};

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ page?: string; size?: string }> }) {

  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const size = Number(params?.size) || 10;

  let activities: Activity[] = [];
  let totalElements = 0;
  let totalPages = 0;

  try {
    const response = await listActivities(page, size);

    activities = response.activities.map(a => ({
      id: a.id.toString(),
      name: a.name,
      status: statusMapping[a.statusCode] || 'Rascunho',
      statusCode: a.statusCode,
      points: a.points,
      createdAt: a.validFrom,
      rowKey: `${a.id}-${a.userActivityId ?? 'no-user'}-${a.farmId ?? 'no-farm'}`,
    }));

    totalElements = response.totalElements;
    totalPages = response.totalPages;
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number };
    if (error.message === 'Token JWT ausente ou inválido' || error.message === 'Unauthorized' || error.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete('token');
      cookieStore.delete('user_info');
      redirect(`/login?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`);
    }
    console.error(error);
  }

  const hasActivities = activities.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-4 pt-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <h1 className="w-72 h-11 text-2xl font-bold text-gray-900 flex items-center">
          Cadastro de atividades
        </h1>

        <div className="flex items-center gap-3">
          <Button
            className="w-56 h-11 bg-[#0B63E5] hover:bg-[#0951bd] text-white gap-3 rounded-sm p-3 text-sm font-medium"
          >
            Cadastrar nova atividade
          </Button>

          <div className="w-48 h-11">
            <ActivitiesFilter />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Table / Empty State */}
        {hasActivities ? (
          <ActivitiesTable
            activities={activities}
            currentPage={page}
            pageSize={size}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center p-8">
            <EmptyState
              title="Sem atividades"
              description="Você ainda não tem nenhuma atividade cadastrada"
            />
          </div>
        )}
      </div>
    </div>
  );
}
