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

export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp: string;
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
    let errorMessage = 'Falha na autenticação';
    try {
      const errorData: ApiErrorResponse = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      console.error('Failed to parse error response', e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ForgotPasswordErrorResponse {
  error: string;
  type: string;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao recuperar senha';
    try {
      const errorData: ForgotPasswordErrorResponse = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      console.error('Failed to parse error response', e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
