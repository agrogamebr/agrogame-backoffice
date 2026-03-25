import config from '@/config';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let token: string | undefined;

  if (typeof window === 'undefined') {
    // Server-side
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  } else {
    // Client-side
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    token = getCookie('token');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = `${config.api.baseUrl}${endpoint}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  return response;
}
