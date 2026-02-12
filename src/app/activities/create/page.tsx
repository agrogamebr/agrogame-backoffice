'use server';

import { CreateActivityForm } from './CreateActivityForm';
import { listCropTypes, listFarms, listProductionUnits, getActivityById, ActivityDetail } from '@/services/activity-create.service';
import { cookies } from 'next/headers';
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
      listProductionUnits(),
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
      console.log('📄 [CreateActivityPage] Activity fetched:', { 
        activityId, 
        thumbnailGsutilUri: initialActivity?.thumbnailGsutilUri 
      });
    }
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

  return (
    <CreateActivityForm
      cropTypes={cropTypes}
      farms={farms}
      productionUnits={productionUnits}
      isEditing={!!activityId}
      initialActivity={initialActivity}
    />
  );
}
