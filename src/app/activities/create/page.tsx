'use server';

import { CreateActivityForm } from './CreateActivityForm';
import { listCropTypes, listFarms, getActivityById, ActivityDetail, ProductionUnitResponse } from '@/services/activity-create.service';

import { redirect } from 'next/navigation';

export default async function CreateActivityPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams;
  const activityId = params.id ? parseInt(params.id, 10) : null;

  let cropTypes: { id: number; label: string }[] = [];
  let farms: { id: number; label: string }[] = [];
  let productionUnits: { id: number; label: string }[] = [];
  let initialActivity: ActivityDetail | null = null;

  try {
    const [cropTypesResponse, farmsResponse, productionUnitsResponse] = await Promise.all([
      listCropTypes(),
      listFarms(),
      Promise.resolve([] as ProductionUnitResponse[]),
    ]);

    cropTypes = cropTypesResponse.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    farms = farmsResponse.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    productionUnits = productionUnitsResponse.map((item) => ({
      id: item.id,
      label: item.name,
    }));

    // If editing, fetch the activity data
    if (activityId) {
      initialActivity = await getActivityById(activityId);
    }
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number };
    if (error.message === 'Token JWT ausente ou inválido' || error.message === 'Unauthorized' || error.status === 401) {
      redirect(`/api/auth/logout?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`);
    }
    console.error(error);
  }

  // Determine view mode based on activity status (server-side security)
  const isViewMode = initialActivity ? 
    (initialActivity.status === 'send' || initialActivity.status === 'completed' || initialActivity.status === 'canceled') 
    : false;

  return (
    <CreateActivityForm
      cropTypes={cropTypes}
      farms={farms}
      productionUnits={productionUnits}
      isEditing={!!activityId}
      initialActivity={initialActivity}
      isViewMode={isViewMode}
    />
  );
}
