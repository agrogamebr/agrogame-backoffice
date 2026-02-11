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
