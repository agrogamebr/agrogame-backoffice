export const API_BASE_URL = 'https://agrogame-api-dev-1017408486443.us-central1.run.app';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface User {
  userId: number;
  email: string;
  name: string;
  userType: string;
}

export interface LoginResponse extends User {
  token: string;
  expiresIn: number;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Falha na autenticação');
  }

  return response.json();
}
