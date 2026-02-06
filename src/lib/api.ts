import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/services/auth.service';

/**
 * Helper function to make authenticated requests from Server Components or Server Actions.
 * It automatically attempts to retrieve the 'token' cookie and attach it as a Bearer token.
 */
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally if needed, though usually middleware handles access.
  // if (response.status === 401) { ... }

  return response;
}
