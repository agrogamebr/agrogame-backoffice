import { apiFetch } from '@/lib/api';

export interface ActivityResponse {
  id: number;
  name: string;
  description: string;
  points: number;
  statusCode: 'draft' | 'send' | 'deleted' | 'completed' | 'cancelled';
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

export async function listActivities(page: number = 0, size: number = 10): Promise<ActivityListResponse> {
  // Backend usa 0-based indexing, então enviamos a página como está
  const response = await apiFetch(`/api/backoffice/activities/list?page=${page}&size=${size}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao listar atividades') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}
