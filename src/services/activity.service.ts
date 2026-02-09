import { apiFetch } from '@/lib/api';

export interface ActivityResponse {
  id: number;
  name: string;
  companyId: number;
  description: string;
  points: number;
  status: 'draft' | 'send' | 'deleted' | 'completed' | 'cancelled';
  validFrom: string;
  validTo: string;
  cropTypeIds: number[];
  userActivityId: number | null;
  userActivityStatus: string | null;
  userActivityFarmId: number | null;
  thumbnailUrl: string | null;
  thumbnailGsutilUri: string | null;
}

export interface ActivityListResponse {
  size: number;
  activities: ActivityResponse[];
  totalPages: number;
  page: number;
  totalElements: number;
}

export async function listActivities(page: number = 1, size: number = 10): Promise<ActivityListResponse> {
  const response = await apiFetch(`/api/activity/list?page=${page}&size=${size}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: any = new Error(errorData.message || 'Erro ao listar atividades');
    error.status = response.status;
    throw error;
  }

  return response.json();
}
