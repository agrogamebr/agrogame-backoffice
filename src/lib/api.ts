import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/services/auth.service';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  return response;
}
