'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function approveProducerLinkAction(userId: number) {
  try {
    console.log('[approveProducerLinkAction] Iniciando aprovação do vínculo. UserID:', userId);
    
    const response = await apiFetch(
      `/api/backoffice/associate/${userId}`,
      {
        method: 'PATCH',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[approveProducerLinkAction] Erro na requisição:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(
        errorData.error || errorData.message || 'Erro ao aprovar vínculo'
      );
    }

    const data = await response.json();
    
    revalidatePath('/vinculos');
    
    return { 
      success: true,
      message: data.message || 'Vínculo aprovado com sucesso'
    };
  } catch (error: unknown) {
    console.error('Error approving producer link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ocorreu um erro ao aprovar o vínculo.'
    };
  }
}
