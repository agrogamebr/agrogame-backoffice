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
  active: boolean;
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
  const response = await apiFetch('/api/farms');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao carregar fazendas') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = (await response.json()) as FarmResponse[];
  return data.filter((item) => item.active);
}

export async function listProductionUnits(): Promise<ProductionUnitResponse[]> {
  const response = await apiFetch('/api/production-units');

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao carregar unidades produtivas') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = (await response.json()) as { items: ProductionUnitResponse[] };
  return data.items.filter((item) => item.isActive);
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

export async function createActivity(data: CreateActivityRequest): Promise<void> {
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

  // Add thumbnail if present
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail);
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const { API_BASE_URL } = await import('@/services/auth.service');

  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Log detailed request information
  console.log('🔍 [Activity Create] Request Details:');
  console.log('📤 Endpoint:', `${API_BASE_URL}/api/activity/create-activity`);
  console.log('📋 FormData Contents:');
  
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
  console.log(JSON.stringify(formDataLog, null, 2));

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
}
