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

export interface UserInfoResponse {
  userId: number;
  fullName: string;
  email1: string | null;
  email2: string | null;
  userTypeId: number;
  userTypeName: string;
  documentNumber: string;
  documentTypeId: number;
  documentTypeCode: string;
  telefone: string | null;
  address: string | null;
  addressNumber: string | null;
  zipCode: string | null;
  city: string | null;
  state: string | null;
}

export interface FarmResponse {
  id: number;
  name: string;
  ownerId: number;
  active: boolean;
  statusLabel: string;
  city: string;
  state: string;
  productionUnits: null;
  cropTypes: string[];
  cropTypesSummary: string;
}

export interface FarmsListResponse {
  content: FarmResponse[];
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
    statusId?: number;
  }
): Promise<ProducersListResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  // Add filter parameters if provided
  if (filters) {
    if (filters.name) params.append('name', filters.name);
    if (filters.cpf) params.append('cpf', filters.cpf);
    if (filters.statusId) params.append('statusId', filters.statusId.toString());
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

export async function getUserInfo(userId: string): Promise<UserInfoResponse> {
  console.log('[getUserInfo] Buscando informações do usuário:', userId);
  
  const endpoint = `/api/backoffice/user-info/${userId}`;
  const response = await apiFetch(endpoint);
  
  console.log('[getUserInfo] Status da resposta:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[getUserInfo] Erro na resposta:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    const error = new Error(errorData.message || 'Erro ao buscar informações do usuário') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  console.log('[getUserInfo] Dados recebidos com sucesso');
  return data;
}

export async function listFarms(
  ownerId: string,
  page: number = 0,
  size: number = 20
): Promise<FarmsListResponse> {
  console.log('[listFarms] Buscando fazendas do produtor:', ownerId);
  
  const params = new URLSearchParams();
  params.append('ownerId', ownerId);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const endpoint = `/api/backoffice/farms/list?${params.toString()}`;
  const response = await apiFetch(endpoint);
  
  console.log('[listFarms] Status da resposta:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[listFarms] Erro na resposta:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    const error = new Error(errorData.message || 'Erro ao buscar fazendas') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  console.log('[listFarms] Dados recebidos com sucesso');
  
  return {
    content: data.content || [],
    totalElements: data.totalElements || 0,
    totalPages: data.totalPages || 0,
    size: data.size || 20,
    number: data.number || 0,
  };
}
