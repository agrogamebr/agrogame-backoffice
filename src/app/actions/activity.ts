'use server';

import { apiFetch } from '@/lib/api';
import { createActivity, updateActivity } from '@/services/activity-create.service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface ValidationError {
  message: string;
  fields: Record<string, string>;
}

// Field name mapping for user-friendly error messages
const fieldLabels: Record<string, string> = {
  activityName: 'Nome da atividade',
  activityDescription: 'Descrição da atividade',
  activityPoints: 'Pontuação',
  startDate: 'Data início',
  endDate: 'Data fim',
  cropTypeIds: 'Cultura',
  thumbnail: 'Imagem da atividade',
  farmIds: 'Fazendas',
  productionUnitIds: 'Unidades produtivas',
};

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

export async function saveActivityDraft(formData: FormData) {
  formData.set('sendNow', 'false');
  await createActivityFromForm(formData);
}

export async function saveAndSendActivity(formData: FormData) {
  formData.set('sendNow', 'true');
  await createActivityFromForm(formData);
}

export async function saveActivityDraftEdit(formData: FormData) {
  const activityId = formData.get('activityId') as string;
  if (!activityId) {
    throw new Error('ID da atividade não fornecido');
  }
  formData.set('sendNow', 'false');
  await updateActivityFromForm(parseInt(activityId, 10), formData);
}

export async function saveAndSendActivityEdit(formData: FormData) {
  const activityId = formData.get('activityId') as string;
  if (!activityId) {
    throw new Error('ID da atividade não fornecido');
  }
  formData.set('sendNow', 'true');
  await updateActivityFromForm(parseInt(activityId, 10), formData);
}

/**
 * Validates form data and returns detailed error messages
 */
function validateActivityForm(formData: FormData): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = (formData.get('activityName') as string)?.trim();
  const description = (formData.get('activityDescription') as string)?.trim();
  const pointsStr = formData.get('activityPoints') as string;
  const validFrom = formData.get('startDate') as string;
  const validTo = formData.get('endDate') as string;
  const cropTypeIds = formData.getAll('cropTypeIds').map((id) => parseInt(id as string, 10));

  console.log('🔍 [Validation] Validating form data:');
  console.log('- Name:', name, 'length:', name?.length);
  console.log('- Description:', description, 'length:', description?.length);
  console.log('- Points:', pointsStr);
  console.log('- Start Date:', validFrom);
  console.log('- End Date:', validTo);
  console.log('- Crop Type IDs:', cropTypeIds, 'count:', cropTypeIds.length);

  // Validate name
  if (!name) {
    errors.activityName = `${fieldLabels.activityName} é obrigatório`;
  } else if (name.length < 3) {
    errors.activityName = `${fieldLabels.activityName} deve ter pelo menos 3 caracteres`;
  } else if (name.length > 100) {
    errors.activityName = `${fieldLabels.activityName} não pode exceder 100 caracteres`;
  }

  // Validate description
  if (!description) {
    errors.activityDescription = `${fieldLabels.activityDescription} é obrigatória`;
  } else if (description.length < 10) {
    errors.activityDescription = `${fieldLabels.activityDescription} deve ter pelo menos 10 caracteres`;
  } else if (description.length > 1000) {
    errors.activityDescription = `${fieldLabels.activityDescription} não pode exceder 1000 caracteres`;
  }

  // Validate points
  if (!pointsStr) {
    errors.activityPoints = `${fieldLabels.activityPoints} é obrigatória`;
  } else {
    const points = parseInt(pointsStr, 10);
    if (isNaN(points)) {
      errors.activityPoints = `${fieldLabels.activityPoints} deve ser um número válido`;
    } else if (points < 0) {
      errors.activityPoints = `${fieldLabels.activityPoints} não pode ser negativa`;
    } else if (points > 99999) {
      errors.activityPoints = `${fieldLabels.activityPoints} é muito alta`;
    }
  }

  // Validate start date
  if (!validFrom) {
    errors.startDate = `${fieldLabels.startDate} é obrigatória`;
  }

  // Validate end date
  if (!validTo) {
    errors.endDate = `${fieldLabels.endDate} é obrigatória`;
  }

  // Validate date range
  if (validFrom && validTo) {
    const startDate = new Date(validFrom);
    const endDate = new Date(validTo);
    if (startDate > endDate) {
      errors.startDate = `${fieldLabels.startDate} deve ser anterior à ${fieldLabels.endDate}`;
    }
  }

  // Validate crop types - FIX: Check for actual values
  if (cropTypeIds.length === 0) {
    errors.cropTypeIds = `Selecione pelo menos uma ${fieldLabels.cropTypeIds}`;
  }

  console.log('✅ [Validation] Results:', { valid: Object.keys(errors).length === 0, errors });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

async function createActivityFromForm(formData: FormData) {
  try {
    console.log('📝 [Create Activity] Starting form submission...');
    
    // Log all form data for debugging
    console.log('🔍 [Create Activity] FormData contents at start:');
    const formDataLog: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        formDataLog[key] = `File: ${value.name} (${value.size} bytes, type: ${value.type})`;
      } else {
        if (formDataLog[key]) {
          if (Array.isArray(formDataLog[key])) {
            (formDataLog[key] as unknown[]).push(value);
          } else {
            formDataLog[key] = [formDataLog[key], value];
          }
        } else {
          formDataLog[key] = value;
        }
      }
    });
    console.log(JSON.stringify(formDataLog, null, 2));
    
    // Validate form data
    const validation = validateActivityForm(formData);
    if (!validation.valid) {
      console.log('❌ [Create Activity] Validation failed:', validation.errors);
      const error = new Error(JSON.stringify(validation.errors)) as Error & { isValidationError?: boolean };
      (error as unknown as Record<string, unknown>).isValidationError = true;
      throw error;
    }
    
    console.log('✅ [Create Activity] Validation passed, proceeding with API request...');

    const sendNow = formData.get('sendNow') === 'true';

    const name = formData.get('activityName') as string;
    const description = formData.get('activityDescription') as string;
    const points = parseInt(formData.get('activityPoints') as string, 10);
    const validFrom = formData.get('startDate') as string;
    const validTo = formData.get('endDate') as string;
    const thumbnail = formData.get('activityImage') as File | null;

    console.log('🖼️ [Create Activity] Extracted image file:', {
      exists: !!thumbnail,
      type: thumbnail instanceof File ? 'File' : typeof thumbnail,
      size: thumbnail instanceof File ? thumbnail.size : 'N/A',
      name: thumbnail instanceof File ? thumbnail.name : 'N/A',
    });

    const cropTypeIds = formData.getAll('cropTypeIds').map((id) => parseInt(id as string, 10));
    const farmIds = formData.getAll('farmIds').map((id) => parseInt(id as string, 10));
    const productionUnitIds = formData.getAll('productionUnitIds').map((id) => parseInt(id as string, 10));

    await createActivity({
      name,
      description,
      points,
      validFrom,
      validTo,
      cropTypeIds,
      thumbnail: thumbnail && thumbnail.size > 0 ? thumbnail : undefined,
      farmIds: farmIds.length > 0 ? farmIds : undefined,
      productionUnitIds: productionUnitIds.length > 0 ? productionUnitIds : undefined,
      sendNow,
    });

    console.log('🎉 [Create Activity] Activity created successfully!');
    redirect('/activities?success=Atividade criada com sucesso');
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number; isValidationError?: boolean };

    // Log API errors for debugging
    console.error('❌ [Create Activity] Error details:', {
      message: error.message,
      status: error.status,
      isValidationError: (error as Record<string, unknown>).isValidationError,
      fullError: error,
    });

    // Handle validation errors
    if ((error as Record<string, unknown>).isValidationError === true) {
      console.log('⚠️ [Create Activity] Re-throwing validation error to client...');
      try {
        const validationErrors = JSON.parse(error.message || '{}');
        const validationError = new Error(JSON.stringify(validationErrors)) as unknown as { isValidationError?: boolean };
        (validationError as Record<string, unknown>).isValidationError = true;
        throw validationError;
      } catch {
        throw error;
      }
    }

    // Handle auth errors
    if (error.message === 'Token JWT ausente ou inválido' || error.message === 'Unauthorized' || error.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete('token');
      cookieStore.delete('user_info');
      redirect(`/login?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`);
    }

    throw error;
  }
}

async function updateActivityFromForm(activityId: number, formData: FormData) {
  try {
    console.log('📝 [Update Activity] Starting form submission...');
    
    // Log all form data for debugging
    console.log('🔍 [Update Activity] FormData contents at start:');
    const formDataLog: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        formDataLog[key] = `File: ${value.name} (${value.size} bytes, type: ${value.type})`;
      } else {
        if (formDataLog[key]) {
          if (Array.isArray(formDataLog[key])) {
            (formDataLog[key] as unknown[]).push(value);
          } else {
            formDataLog[key] = [formDataLog[key], value];
          }
        } else {
          formDataLog[key] = value;
        }
      }
    });
    console.log(JSON.stringify(formDataLog, null, 2));
    
    // Validate form data
    const validation = validateActivityForm(formData);
    if (!validation.valid) {
      console.log('❌ [Update Activity] Validation failed:', validation.errors);
      const error = new Error(JSON.stringify(validation.errors)) as Error & { isValidationError?: boolean };
      (error as unknown as Record<string, unknown>).isValidationError = true;
      throw error;
    }
    
    console.log('✅ [Update Activity] Validation passed, proceeding with API request...');

    const sendNow = formData.get('sendNow') === 'true';

    const name = formData.get('activityName') as string;
    const description = formData.get('activityDescription') as string;
    const points = parseInt(formData.get('activityPoints') as string, 10);
    const validFrom = formData.get('startDate') as string;
    const validTo = formData.get('endDate') as string;
    const thumbnail = formData.get('activityImage') as File | null;

    const cropTypeIds = formData.getAll('cropTypeIds').map((id) => parseInt(id as string, 10));
    const farmIds = formData.getAll('farmIds').map((id) => parseInt(id as string, 10));
    const productionUnitIds = formData.getAll('productionUnitIds').map((id) => parseInt(id as string, 10));

    console.log('🖼️ [Update Activity] Extracted image file:', {
      exists: !!thumbnail,
      type: thumbnail instanceof File ? 'File' : typeof thumbnail,
      size: thumbnail instanceof File ? thumbnail.size : 'N/A',
      name: thumbnail instanceof File ? thumbnail.name : 'N/A',
    });

    await updateActivity(activityId, {
      name,
      description,
      points,
      validFrom,
      validTo,
      cropTypeIds,
      thumbnail: thumbnail && thumbnail.size > 0 ? thumbnail : undefined,
      farmIds: farmIds.length > 0 ? farmIds : undefined,
      productionUnitIds: productionUnitIds.length > 0 ? productionUnitIds : undefined,
      sendNow,
    });

    console.log('🎉 [Update Activity] Activity updated successfully!');
    redirect('/activities?success=Atividade atualizada com sucesso');
  } catch (e: unknown) {
    const error = e as { message?: string; status?: number; isValidationError?: boolean };

    // Log API errors for debugging
    console.error('❌ [Update Activity] Error details:', {
      message: error.message,
      status: error.status,
      isValidationError: (error as Record<string, unknown>).isValidationError,
      fullError: error,
    });

    // Handle validation errors
    if ((error as Record<string, unknown>).isValidationError === true) {
      console.log('⚠️ [Update Activity] Re-throwing validation error to client...');
      try {
        const validationErrors = JSON.parse(error.message || '{}');
        const validationError = new Error(JSON.stringify(validationErrors)) as unknown as { isValidationError?: boolean };
        (validationError as Record<string, unknown>).isValidationError = true;
        throw validationError;
      } catch {
        throw error;
      }
    }

    // Handle auth errors
    if (error.message === 'Token JWT ausente ou inválido' || error.message === 'Unauthorized' || error.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete('token');
      cookieStore.delete('user_info');
      redirect(`/login?error=${encodeURIComponent(error.message || 'Erro desconhecido')}`);
    }

    throw error;
  }
}
