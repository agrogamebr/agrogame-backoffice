import Link from 'next/link';
import { ActivitiesFilter } from '@/components/activities/ActivitiesFilter';
import { EmptyState } from '@/components/activities/EmptyState';
import { ActivitiesTable, Activity, ActivityStatus } from '@/components/activities/ActivitiesTable';
import { listActivities } from '@/services/activity.service';
import { listCropTypes, listFarms, listProductionUnits, ProductionUnitResponse } from '@/services/activity-create.service';
import { redirect } from 'next/navigation';
import { ActivitiesToastHandler } from '@/components/activities/ActivitiesToastHandler';

const statusMapping: Record<string, ActivityStatus> = {
  'draft': 'Rascunho',
  'send': 'Enviado',
  'deleted': 'Excluída',
  'completed': 'Completado',
  'canceled': 'Cancelado',
};

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<{ page?: string; size?: string; status?: string; cropTypeId?: string; farmId?: string; productionUnitId?: string; startDate?: string; endDate?: string }> }) {

  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const size = Number(params?.size) || 10;

  // Build filters object from query params
  const filters = {
    status: params?.status,
    cropTypeId: params?.cropTypeId,
    farmId: params?.farmId,
    productionUnitId: params?.productionUnitId,
    startDate: params?.startDate,
    endDate: params?.endDate,
  };

  let activities: Activity[] = [];
  let totalElements = 0;
  let totalPages = 0;
  let cropTypes: { id: number; name: string }[] = [];
  let farms: { id: number; name: string }[] = [];
  let productionUnits: { id: number; name: string }[] = [];

  try {
    // Load filter options in parallel
    const [cropTypesResponse, farmsResponse, productionUnitsResponse, activitiesResponse] = await Promise.all([
      listCropTypes(),
      listFarms(),
      Promise.resolve([] as ProductionUnitResponse[]),
      listActivities(page, size, filters),
    ]);

    cropTypes = cropTypesResponse.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    farms = farmsResponse.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    productionUnits = productionUnitsResponse.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    activities = activitiesResponse.activities.map(a => ({
      id: a.id.toString(),
      name: a.name,
      status: statusMapping[a.statusCode] || 'Rascunho',
      statusCode: a.statusCode,
      points: a.points,
      createdAt: a.validFrom,
      rowKey: `${a.id}-${a.userActivityId ?? 'no-user'}-${a.farmId ?? 'no-farm'}`,
    }));

    totalElements = activitiesResponse.totalElements;
    totalPages = activitiesResponse.totalPages;
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number };
    if (error.message === 'Token JWT ausente ou inválido' || error.message === 'Unauthorized' || error.status === 401) {
      redirect(`/api/auth/logout?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`);
    }
    console.error(error);
  }

  const hasActivities = activities.length > 0;

  return (
    <div className="max-w-8xl mx-4 space-y-4 pt-14">
      <ActivitiesToastHandler />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <h1 className="w-92 h-11 text-2xl font-bold text-gray-900 flex items-center">
          Gerenciamento de atividades
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/activities/create"
            className="w-56 h-11 bg-[#0B63E5] hover:bg-[#0951bd] text-white gap-3 rounded-sm p-3 text-sm font-medium inline-flex items-center justify-center"
          >
            Cadastrar nova atividade
          </Link>

          <div className="w-48 h-11">
            <ActivitiesFilter
              cropTypes={cropTypes}
              farms={farms}
              productionUnits={productionUnits}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
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


