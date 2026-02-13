'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

interface DecisionRequest {
  decision: 'approved' | 'rejected';
  reason?: string;
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
  } catch (error: any) {
    console.error('Error submitting decision:', error);
    return {
      success: false,
      error: error.message || 'Ocorreu um erro ao salvar a decisão.'
    };
  }
}
