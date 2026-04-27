import { apiFetch } from '@/lib/api';

export interface ActivityResponse {
  id: number;
  name: string;
  description: string;
  points: number;
  statusCode: 'draft' | 'send' | 'deleted' | 'completed' | 'canceled';
  validFrom: string;
  validTo: string;
  thumbnailUrl: string | null;
  thumbnailGsutilUri: string | null;
  userActivityId: number | null;
  userActivityStatus: string | null;
  producerId: number;
  farmId: number;
  productionUnitId: number | null;
}

export interface ActivityListResponse {
  size: number;
  activities: ActivityResponse[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export async function listActivities(
  page: number = 0,
  size: number = 10,
  filters?: {
    status?: string;
    cropTypeId?: string;
    farmId?: string;
    productionUnitId?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<ActivityListResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  // Add filter parameters if provided
  if (filters) {
    if (filters.status) params.append('status', filters.status);
    if (filters.cropTypeId) params.append('cropTypeId', filters.cropTypeId);
    if (filters.farmId) params.append('farmId', filters.farmId);
    if (filters.productionUnitId) params.append('productionUnitId', filters.productionUnitId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
  }

  const response = await apiFetch(`/api/backoffice/activities/list?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao listar ações') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}
