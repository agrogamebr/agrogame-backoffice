import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { USER_TYPES } from '@/types/user-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskCpf(cpf: string): string {
  if (!cpf || cpf === 'N/A') {
    return '-';
  }
  
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) {
    return cpf;
  }
  
  return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9)}`;
}

/**
 * Verifica se o usuário tem privilégios de administrador.
 * Inclui tanto 'Administrador' quanto 'SuperAdmin'.
 */
export function hasAdminPrivileges(userType?: string | null): boolean {
  if (!userType) return false;
  return userType === USER_TYPES.ADMIN || userType === USER_TYPES.SUPER_ADMIN;
}

/**
 * Verifica se o usuário é SuperAdmin (acesso total ao sistema).
 */
export function isSuperAdmin(userType?: string | null): boolean {
  return userType === USER_TYPES.SUPER_ADMIN;
}
