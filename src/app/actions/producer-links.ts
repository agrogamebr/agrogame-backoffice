'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function proccessProducerLinkAction(userId: number, action: 'approved' | 'rejected') {
  try {
    console.log(`[proccessProducerLinkAction] Iniciando ação ${action} do vínculo. UserID:`, userId);
    
    const requestBody = { action };
    console.log('[proccessProducerLinkAction] Body da requisição:', requestBody);
    console.log('[proccessProducerLinkAction] Body JSON stringificado:', JSON.stringify(requestBody));
    
    const response = await apiFetch(
      `/api/backoffice/associate/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[proccessProducerLinkAction] Erro na requisição ao ${action} vínculo:`, {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(
        errorData.error || errorData.message || `Erro ao processar requisição de vínculo`
      );
    }

    const data = await response.json();

    console.log("[proccessProducerLinkAction] Resposta da API:", data);
    
    revalidatePath('/vinculos');
    
    return { 
      success: true,
      message: data.message || `Vínculo ${action === 'approved' ? 'aprovado' : 'reprovado'} com sucesso`
    };
  } catch (error: unknown) {
    console.error('Error processing producer link action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Ocorreu um erro ao ${action === 'approved' ? 'aprovar' : 'reprovar'} o vínculo.`
    };
  }
}