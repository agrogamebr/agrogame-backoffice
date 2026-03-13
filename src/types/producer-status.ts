export enum ProducerStatusId {
  APPROVED = 1,
  ACTIVE = 2,
  PENDING = 3,
  REJECTED = 4,
  INACTIVE = 5,
  SUSPENDED = 6,
}

export enum ProducerStatusCode {
  APPROVED = 'approved',
  ACTIVE = 'active',
  PENDING = 'pending',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export type ProducerStatusDisplay = 'Aprovado' | 'Ativo' | 'Pendente' | 'Rejeitado' | 'Inativo' | 'Suspenso';

// Mapeamento de statusId para código
export const STATUS_ID_TO_CODE: Record<ProducerStatusId, ProducerStatusCode> = {
  [ProducerStatusId.APPROVED]: ProducerStatusCode.APPROVED,
  [ProducerStatusId.ACTIVE]: ProducerStatusCode.ACTIVE,
  [ProducerStatusId.PENDING]: ProducerStatusCode.PENDING,
  [ProducerStatusId.REJECTED]: ProducerStatusCode.REJECTED,
  [ProducerStatusId.INACTIVE]: ProducerStatusCode.INACTIVE,
  [ProducerStatusId.SUSPENDED]: ProducerStatusCode.SUSPENDED,
};

// Mapeamento de código para statusId
export const STATUS_CODE_TO_ID: Record<ProducerStatusCode, ProducerStatusId> = {
  [ProducerStatusCode.APPROVED]: ProducerStatusId.APPROVED,
  [ProducerStatusCode.ACTIVE]: ProducerStatusId.ACTIVE,
  [ProducerStatusCode.PENDING]: ProducerStatusId.PENDING,
  [ProducerStatusCode.REJECTED]: ProducerStatusId.REJECTED,
  [ProducerStatusCode.INACTIVE]: ProducerStatusId.INACTIVE,
  [ProducerStatusCode.SUSPENDED]: ProducerStatusId.SUSPENDED,
};

// Mapeamento para exibição em português
export const STATUS_DISPLAY: Record<ProducerStatusId, ProducerStatusDisplay> = {
  [ProducerStatusId.APPROVED]: 'Aprovado',
  [ProducerStatusId.ACTIVE]: 'Ativo',
  [ProducerStatusId.PENDING]: 'Pendente',
  [ProducerStatusId.REJECTED]: 'Rejeitado',
  [ProducerStatusId.INACTIVE]: 'Inativo',
  [ProducerStatusId.SUSPENDED]: 'Suspenso',
};

// Mapeamento inverso de exibição para statusId
export const DISPLAY_TO_STATUS_ID: Record<ProducerStatusDisplay, ProducerStatusId> = {
  'Aprovado': ProducerStatusId.APPROVED,
  'Ativo': ProducerStatusId.ACTIVE,
  'Pendente': ProducerStatusId.PENDING,
  'Rejeitado': ProducerStatusId.REJECTED,
  'Inativo': ProducerStatusId.INACTIVE,
  'Suspenso': ProducerStatusId.SUSPENDED,
};

// Status disponíveis para filtro (apenas os que fazem sentido filtrar no backoffice)
export const FILTERABLE_STATUSES: Array<{ id: ProducerStatusId; label: ProducerStatusDisplay }> = [
  { id: ProducerStatusId.APPROVED, label: 'Aprovado' },
  { id: ProducerStatusId.PENDING, label: 'Pendente' },
  { id: ProducerStatusId.REJECTED, label: 'Rejeitado' },
  { id: ProducerStatusId.INACTIVE, label: 'Inativo' },
  { id: ProducerStatusId.SUSPENDED, label: 'Suspenso' },
];
