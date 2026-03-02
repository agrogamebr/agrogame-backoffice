import { apiFetch } from '@/lib/api';

export interface CropTypeResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CropTypesListResponse {
  crop_types: CropTypeResponse[];
  total: number;
}

export interface FarmResponse {
  id: number;
  name: string;
  ownerId: number;
}

export interface ProductionUnitResponse {
  id: number;
  name: string;
  isActive: boolean;
}

export async function listCropTypes(): Promise<CropTypeResponse[]> {
  const response = await apiFetch('/api/crop-types/list');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao carregar culturas') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = (await response.json()) as CropTypesListResponse;

  return data.crop_types.filter((item) => item.isActive);
}

export async function listFarms(): Promise<FarmResponse[]> {
  const response = await apiFetch('/api/backoffice/farms/list');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao carregar fazendas') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  // Handle different potential response structures
  if (data.farms && Array.isArray(data.farms)) {
    return data.farms;
  }

  if (data.items && Array.isArray(data.items)) {
    return data.items;
  }

  if (data.content && Array.isArray(data.content)) {
    return data.content;
  }

  console.warn('Unexpected farms response structure:', data);
  return [];
}

export async function listProductionUnits(): Promise<ProductionUnitResponse[]> {
  const response = await apiFetch('/api/production-units');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao carregar unidades produtivas') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = (await response.json()) as { items?: ProductionUnitResponse[]; content?: ProductionUnitResponse[] };

  const units = data.content || data.items || [];
  return units.filter((item) => item.isActive);
}

export async function listProductionUnitsFiltered(
  farmIds: number[],
  cropTypeIds: number[]
): Promise<ProductionUnitResponse[]> {

  // If no farms are selected, we shouldn't return any production units
  if (!farmIds || farmIds.length === 0) {
    return [];
  }

  // If no crops are selected, we just fetch based on farms
  const activeCropIds = cropTypeIds.length > 0 ? cropTypeIds : [null];

  // We need to fetch for each combination of farm and crop
  // Since the API only accepts single values, we'll make parallel requests
  const promises: Promise<ProductionUnitResponse[]>[] = [];

  for (const farmId of farmIds) {
    for (const cropTypeId of activeCropIds) {
      const params = new URLSearchParams();
      params.append('farmId', farmId.toString());
      if (cropTypeId) {
        params.append('cropTypeId', cropTypeId.toString());
      }

      const url = `/api/backoffice/production-units/list?${params.toString()}`;

      promises.push(
        apiFetch(url)
          .then(async (res) => {

            if (!res.ok) {
              const errorText = await res.text().catch(() => 'Failed to read error text');
              console.error(`Error fetching units for farm ${farmId}. Status: ${res.status}, Body: ${errorText}`);
              return [];
            }

            try {
              const rawData = await res.json();

              let items: ProductionUnitResponse[] = [];

              if (Array.isArray(rawData)) {
                items = rawData;
              } else if (rawData.content && Array.isArray(rawData.content)) {
                items = rawData.content;
              } else if (rawData.items && Array.isArray(rawData.items)) {
                items = rawData.items;
              } else {
                console.warn(`Unexpected response structure for ${url}:`, rawData);
              }

              return items;
            } catch (e) {
              console.error(`Error parsing JSON for ${url}:`, e);
              return [];
            }
          })
          .catch((err) => {
            console.error(`Network or unexpected error fetching production units for farm ${farmId}:`, err);
            return [];
          })
      );
    }
  }

  const results = await Promise.all(promises);

  // Flatten and deduplicate results
  const allUnits = results.flat();
  const uniqueUnits = new Map<number, ProductionUnitResponse>();

  allUnits.forEach((unit) => {
    // Check if unit object is valid and has id
    if (unit && typeof unit.id !== 'undefined') {
      // Only filter by isActive if the property exists and is explicitly false
      if (unit.isActive === false) return;
      uniqueUnits.set(unit.id, unit);
    }
  });

  const finalUnits = Array.from(uniqueUnits.values());

  return finalUnits;
}

export interface CreateActivityRequest {
  description: string;
  name: string;
  points: number;
  validFrom: string;
  validTo: string;
  cropTypeIds: number[];
  thumbnail?: File;
  farmIds?: number[];
  productionUnitIds?: number[];
  sendNow: boolean;
}

/**
 * Uploads a thumbnail for an activity
 * @param activityId - The ID of the activity
 * @param thumbnail - The thumbnail file to upload
 */
export async function uploadActivityThumbnail(activityId: number, thumbnail: File): Promise<void> {
  const formData = new FormData();
  formData.append('thumbnail', thumbnail);

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const { API_BASE_URL } = await import('@/services/auth.service');

  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/activity/activities/${activityId}/thumbnail`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao fazer upload do thumbnail') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
}

export async function sendActivity(activityId: number): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const { API_BASE_URL } = await import('@/services/auth.service');

  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/activity/${activityId}/send`, {
    method: 'PATCH',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao enviar atividade') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
}

export async function createActivity(data: CreateActivityRequest): Promise<number> {
  const formData = new FormData();

  formData.append('description', data.description);
  formData.append('name', data.name);
  formData.append('points', data.points.toString());
  formData.append('validFrom', data.validFrom);
  formData.append('validTo', data.validTo);
  formData.append('sendNow', data.sendNow.toString());

  // Add crop type IDs as array
  data.cropTypeIds.forEach((id) => {
    formData.append('cropTypeIds', id.toString());
  });

  // Add farm IDs as array (optional)
  if (data.farmIds && data.farmIds.length > 0) {
    data.farmIds.forEach((id) => {
      formData.append('farmIds', id.toString());
    });
  }

  // Add production unit IDs as array (optional)
  if (data.productionUnitIds && data.productionUnitIds.length > 0) {
    data.productionUnitIds.forEach((id) => {
      formData.append('productionUnitIds', id.toString());
    });
  }

  // Note: thumbnail will be uploaded separately after activity creation

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const { API_BASE_URL } = await import('@/services/auth.service');

  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Convert FormData to readable object for logging
  const formDataLog: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (formDataLog[key]) {
      if (Array.isArray(formDataLog[key])) {
        (formDataLog[key] as unknown[]).push(value);
      } else {
        formDataLog[key] = [formDataLog[key], value];
      }
    } else {
      formDataLog[key] = value;
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/activity/create-activity`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao criar atividade') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const responseData = await response.json();
  const activityId = responseData.id || responseData.activityId;

  if (!activityId) {
    throw new Error('ID da atividade não foi retornado pela API');
  }

  // Upload thumbnail separately if present
  if (data.thumbnail) {
    await uploadActivityThumbnail(activityId, data.thumbnail);
  }

  return activityId;
}

export interface ActivityDetail {
  companyId: number;
  thumbnailGsutilUri: string;
  name: string;
  description: string;
  cropTypeIds: number[];
  id: number;
  validFrom: string;
  points: number;
  status: string;
  validTo: string;
  thumbnailUrl: string;
  farmIds?: number[];
  productionUnitIds?: number[];
}

export async function getActivityById(activityId: number): Promise<ActivityDetail> {
  const response = await apiFetch(`/api/activity/${activityId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao buscar atividade') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as ActivityDetail;
}

export interface UpdateActivityRequest {
  description: string;
  name: string;
  points: number;
  validFrom: string;
  validTo: string;
  cropTypeIds: number[];
  thumbnail?: File;
  farmIds?: number[];
  productionUnitIds?: number[];
  sendNow: boolean;
}

export async function updateActivity(activityId: number, data: UpdateActivityRequest, send: boolean = false): Promise<void> {
  // Format dates to YYYY-MM-DD
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const requestBody = {
    description: data.description,
    name: data.name,
    points: data.points,
    validFrom: formatDate(data.validFrom),
    validTo: formatDate(data.validTo),
    sendNow: data.sendNow,
    thumbnailUrl: null,
    cropTypeIds: data.cropTypeIds || [],
    farmIds: data.farmIds || [],
    productionUnitIds: data.productionUnitIds || [],
  };

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const { API_BASE_URL } = await import('@/services/auth.service');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/activity/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify(requestBody),
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao atualizar atividade') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  // Upload thumbnail separately if present
  if (data.thumbnail) {
    await uploadActivityThumbnail(activityId, data.thumbnail);
  }

  if (send) {
    await sendActivity(activityId);
  }
}
