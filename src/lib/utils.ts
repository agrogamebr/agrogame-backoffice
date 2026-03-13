import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
