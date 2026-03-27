/**
 * Enumerador de Status do Sistema
 * 
 * IDs conforme especificação:
 * 1 - approved - Aprovado
 * 2 - active - Ativo
 * 3 - pending - Pendente
 * 4 - rejected - Rejeitado
 * 5 - inactive - Inativo
 * 6 - suspended - Suspenso
 */

export enum StatusId {
  APPROVED = 1,
  ACTIVE = 2,
  PENDING = 3,
  REJECTED = 4,
  INACTIVE = 5,
  SUSPENDED = 6,
}

export enum StatusCode {
  APPROVED = 'approved',
  ACTIVE = 'active',
  PENDING = 'pending',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export type StatusDisplay = 
  | 'Aprovado' 
  | 'Ativo' 
  | 'Pendente' 
  | 'Rejeitado' 
  | 'Inativo' 
  | 'Suspenso';

export type BadgeVariant = 'enviado' | 'pendente' | 'excluida';

/**
 * Estrutura completa de um status
 */
export interface Status {
  id: StatusId;
  code: StatusCode;
  display: StatusDisplay;
}

/**
 * Lista completa de todos os status
 */
export const ALL_STATUSES: Status[] = [
  { id: StatusId.APPROVED, code: StatusCode.APPROVED, display: 'Aprovado' },
  { id: StatusId.ACTIVE, code: StatusCode.ACTIVE, display: 'Ativo' },
  { id: StatusId.PENDING, code: StatusCode.PENDING, display: 'Pendente' },
  { id: StatusId.REJECTED, code: StatusCode.REJECTED, display: 'Rejeitado' },
  { id: StatusId.INACTIVE, code: StatusCode.INACTIVE, display: 'Inativo' },
  { id: StatusId.SUSPENDED, code: StatusCode.SUSPENDED, display: 'Suspenso' },
];

// ============================================================================
// MAPEAMENTOS DE ID
// ============================================================================

export const STATUS_ID_TO_CODE: Record<StatusId, StatusCode> = {
  [StatusId.APPROVED]: StatusCode.APPROVED,
  [StatusId.ACTIVE]: StatusCode.ACTIVE,
  [StatusId.PENDING]: StatusCode.PENDING,
  [StatusId.REJECTED]: StatusCode.REJECTED,
  [StatusId.INACTIVE]: StatusCode.INACTIVE,
  [StatusId.SUSPENDED]: StatusCode.SUSPENDED,
};

export const STATUS_ID_TO_DISPLAY: Record<StatusId, StatusDisplay> = {
  [StatusId.APPROVED]: 'Aprovado',
  [StatusId.ACTIVE]: 'Ativo',
  [StatusId.PENDING]: 'Pendente',
  [StatusId.REJECTED]: 'Rejeitado',
  [StatusId.INACTIVE]: 'Inativo',
  [StatusId.SUSPENDED]: 'Suspenso',
};

// ============================================================================
// MAPEAMENTOS DE CODE
// ============================================================================

export const STATUS_CODE_TO_ID: Record<StatusCode, StatusId> = {
  [StatusCode.APPROVED]: StatusId.APPROVED,
  [StatusCode.ACTIVE]: StatusId.ACTIVE,
  [StatusCode.PENDING]: StatusId.PENDING,
  [StatusCode.REJECTED]: StatusId.REJECTED,
  [StatusCode.INACTIVE]: StatusId.INACTIVE,
  [StatusCode.SUSPENDED]: StatusId.SUSPENDED,
};

export const STATUS_CODE_TO_DISPLAY: Record<StatusCode, StatusDisplay> = {
  [StatusCode.APPROVED]: 'Aprovado',
  [StatusCode.ACTIVE]: 'Ativo',
  [StatusCode.PENDING]: 'Pendente',
  [StatusCode.REJECTED]: 'Rejeitado',
  [StatusCode.INACTIVE]: 'Inativo',
  [StatusCode.SUSPENDED]: 'Suspenso',
};

// ============================================================================
// MAPEAMENTOS DE DISPLAY
// ============================================================================

export const STATUS_DISPLAY_TO_ID: Record<StatusDisplay, StatusId> = {
  'Aprovado': StatusId.APPROVED,
  'Ativo': StatusId.ACTIVE,
  'Pendente': StatusId.PENDING,
  'Rejeitado': StatusId.REJECTED,
  'Inativo': StatusId.INACTIVE,
  'Suspenso': StatusId.SUSPENDED,
};

export const STATUS_DISPLAY_TO_CODE: Record<StatusDisplay, StatusCode> = {
  'Aprovado': StatusCode.APPROVED,
  'Ativo': StatusCode.ACTIVE,
  'Pendente': StatusCode.PENDING,
  'Rejeitado': StatusCode.REJECTED,
  'Inativo': StatusCode.INACTIVE,
  'Suspenso': StatusCode.SUSPENDED,
};

// ============================================================================
// MAPEAMENTO DE BADGE VARIANTS
// ============================================================================

export const STATUS_TO_BADGE_VARIANT: Record<StatusDisplay, BadgeVariant> = {
  'Aprovado': 'enviado',
  'Ativo': 'enviado',
  'Pendente': 'pendente',
  'Rejeitado': 'excluida',
  'Inativo': 'excluida',
  'Suspenso': 'excluida',
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Obtém o display name a partir do statusId
 */
export function getDisplayFromId(statusId: number): StatusDisplay {
  return STATUS_ID_TO_DISPLAY[statusId as StatusId] || 'Pendente';
}

/**
 * Obtém o display name a partir do statusCode
 */
export function getDisplayFromCode(statusCode: string): StatusDisplay {
  return STATUS_CODE_TO_DISPLAY[statusCode as StatusCode] || 'Pendente';
}

/**
 * Obtém o statusCode a partir do statusId
 */
export function getCodeFromId(statusId: number): StatusCode {
  return STATUS_ID_TO_CODE[statusId as StatusId] || StatusCode.PENDING;
}

/**
 * Obtém o statusId a partir do statusCode
 */
export function getIdFromCode(statusCode: string): StatusId {
  return STATUS_CODE_TO_ID[statusCode as StatusCode] || StatusId.PENDING;
}

/**
 * Obtém a variante do Badge para um status
 */
export function getBadgeVariant(status: StatusDisplay | string): BadgeVariant {
  return STATUS_TO_BADGE_VARIANT[status as StatusDisplay] || 'pendente';
}

/**
 * Verifica se um status é "Pendente"
 */
export function isPending(statusId?: number, statusCode?: string): boolean {
  if (statusId !== undefined) return statusId === StatusId.PENDING;
  if (statusCode !== undefined) return statusCode === StatusCode.PENDING;
  return false;
}

/**
 * Verifica se um status é "Aprovado"
 */
export function isApproved(statusId?: number, statusCode?: string): boolean {
  if (statusId !== undefined) return statusId === StatusId.APPROVED;
  if (statusCode !== undefined) return statusCode === StatusCode.APPROVED;
  return false;
}

/**
 * Verifica se um status é "Rejeitado"
 */
export function isRejected(statusId?: number, statusCode?: string): boolean {
  if (statusId !== undefined) return statusId === StatusId.REJECTED;
  if (statusCode !== undefined) return statusCode === StatusCode.REJECTED;
  return false;
}

/**
 * Verifica se um status é "Ativo"
 */
export function isActive(statusId?: number, statusCode?: string): boolean {
  if (statusId !== undefined) return statusId === StatusId.ACTIVE;
  if (statusCode !== undefined) return statusCode === StatusCode.ACTIVE;
  return false;
}

// ============================================================================
// COMPATIBILIDADE COM CÓDIGO ANTIGO
// ============================================================================

/**
 * @deprecated Use StatusId ao invés de ProducerStatusId
 */
export const ProducerStatusId = StatusId;

/**
 * @deprecated Use StatusCode ao invés de ProducerStatusCode
 */
export const ProducerStatusCode = StatusCode;

/**
 * @deprecated Use StatusDisplay ao invés de ProducerStatusDisplay
 */
export type ProducerStatusDisplay = StatusDisplay;

/**
 * @deprecated Use STATUS_ID_TO_DISPLAY ao invés de STATUS_DISPLAY
 */
export const STATUS_DISPLAY = STATUS_ID_TO_DISPLAY;

/**
 * @deprecated Use STATUS_DISPLAY_TO_ID ao invés de DISPLAY_TO_STATUS_ID
 */
export const DISPLAY_TO_STATUS_ID = STATUS_DISPLAY_TO_ID;

/**
 * Status disponíveis para filtro
 */
export const FILTERABLE_STATUSES: Array<{ id: StatusId; label: StatusDisplay }> = [
  { id: StatusId.APPROVED, label: 'Aprovado' },
  { id: StatusId.PENDING, label: 'Pendente' },
  { id: StatusId.REJECTED, label: 'Rejeitado' },
  { id: StatusId.INACTIVE, label: 'Inativo' },
  { id: StatusId.SUSPENDED, label: 'Suspenso' },
];
