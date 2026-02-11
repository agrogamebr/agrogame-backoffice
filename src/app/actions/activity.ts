'use server';

import { apiFetch } from '@/lib/api';

export async function cancelActivity(activityId: number | string): Promise<void> {
  const response = await apiFetch(`/api/activity/${activityId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao cancelar atividade') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
}
