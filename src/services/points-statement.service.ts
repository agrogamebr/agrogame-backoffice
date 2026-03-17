import { apiFetch } from '@/lib/api';

export interface PointsStatementItem {
  id: number;
  date: string;
  description: string;
  farmName: string;
  productionUnitName: string | null;
  operationType: string;
  points: number;
  balanceAfter: number;
}

export interface PointsStatementResponse {
  size: number;
  currentBalance: number;
  totalPages: number;
  page: number;
  items: PointsStatementItem[];
  totalElements: number;
}

export async function getPointsStatement(
  producerId: number,
  page: number = 0,
  size: number = 10,
  filters?: {
    farmId?: number;
    productionUnitId?: number;
    operationType?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<PointsStatementResponse> {
  const params = new URLSearchParams();
  params.append('producerId', producerId.toString());
  params.append('page', page.toString());
  params.append('size', size.toString());

  // Add filter parameters if provided
  if (filters) {
    if (filters.farmId) params.append('farmId', filters.farmId.toString());
    if (filters.productionUnitId) params.append('productionUnitId', filters.productionUnitId.toString());
    if (filters.operationType) params.append('operationType', filters.operationType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
  }

  const response = await apiFetch(`/api/backoffice/points/statement?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Erro ao buscar extrato de pontos') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  
  return {
    size: data.size || 20,
    currentBalance: data.currentBalance || 0,
    totalPages: data.totalPages || 0,
    page: data.page || 0,
    items: data.items || [],
    totalElements: data.totalElements || 0,
  };
}
