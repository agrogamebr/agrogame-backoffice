'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

interface DecisionRequest {
  decision: 'approved' | 'rejected';
  reason?: string;
}

export interface ActivityReview {
  id: number;
  statusCode: string;
  statusName: string;
  reviewerName: string;
  reviewerId: number;
  notes: string;
  reviewedAt: string;
}

export interface ActivityDetailsResponse {
  id: number;
  userId: number;
  activityId: number;
  statusId: number;
  statusName: string;
  statusCode: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  createdById: number;
  updatedAt: string;
  updatedById: number;
  farmId: number;
  reviews: ActivityReview[];
}

export async function submitDecisionAction(
  userActivityId: number,
  data: DecisionRequest
) {
  try {
    const response = await apiFetch(
      `/api/backoffice/activities/submissions/${userActivityId}/decision`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 'Erro ao enviar decisão da atividade'
      );
    }

    revalidatePath('/completed-activities');
    return { success: true };
  } catch (error: unknown) {
    const e = error as { message?: string };
    console.error('Error submitting decision:', error);
    return {
      success: false,
      error: e.message || 'Ocorreu um erro ao salvar a decisão.'
    };
  }
}

export async function getActivityDetailsAction(userActivityId: number) {
  try {
    const endpoint = `/api/backoffice/activities/${userActivityId}`;
    
    const response = await apiFetch(endpoint);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 'Erro ao buscar detalhes da atividade'
      );
    }

    const data: ActivityDetailsResponse = await response.json();
    
    return { success: true, data };
  } catch (error: unknown) {
    const e = error as { message?: string };
    return {
      success: false,
      error: e.message || 'Ocorreu um erro ao buscar os detalhes.'
    };
  }
}
