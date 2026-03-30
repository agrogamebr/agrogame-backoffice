/**
 * Tipos de usuário disponíveis no sistema
 */
export type UserType = 'SuperAdmin' | 'Administrador' | string;

/**
 * Constantes dos tipos de usuário
 */
export const USER_TYPES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Administrador',
} as const;

/**
 * Descrição dos tipos de usuário e suas permissões
 */
export const USER_TYPE_DESCRIPTIONS = {
  SuperAdmin: 'Acesso total ao sistema sem restrições',
  Administrador: 'Acesso a funcionalidades administrativas',
} as const;
