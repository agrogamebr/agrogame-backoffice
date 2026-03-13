import { apiFetch } from '@/lib/api';

export interface ProducerResponse {
  userId: number;
  fullName: string;
  cpf: string | null;
  statusId: number;
  statusName: string;
  createdAt: string;
}

export interface ProducersListResponse {
  content: ProducerResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function listProducers(
  page: number = 0,
  size: number = 10,
  filters?: {
    name?: string;
    cpf?: string;
    status?: string;
  }
): Promise<ProducersListResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  // Add filter parameters if provided
  if (filters) {
    if (filters.name) params.append('name', filters.name);
    if (filters.cpf) params.append('cpf', filters.cpf);
    if (filters.status) params.append('status', filters.status);
  }

  const response = await apiFetch(`/api/backoffice/producers/list?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao listar produtores') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  
  return {
    content: data.content || [],
    totalElements: data.totalElements || 0,
    totalPages: data.totalPages || 0,
    size: data.size || 10,
    number: data.number || 0,
  };
}
