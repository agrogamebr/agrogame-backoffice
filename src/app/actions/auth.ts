'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login, LoginRequest, User } from '@/services/auth.service';

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  if (!identifier || !password) {
    return { error: 'Por favor, preencha todos os campos.' };
  }

  try {
    const response = await login({ identifier, password });

    const cookieStore = await cookies();

    // Store the secure token (HttpOnly)
    cookieStore.set('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: response.expiresIn / 1000, // API returns ms, cookie expects seconds
      path: '/',
    });

    // Store non-sensitive user info for the UI (Accessible by client)
    const userInfo: User = {
      userId: response.userId,
      email: response.email,
      name: response.name,
      userType: response.userType,
    };

    cookieStore.set('user_info', JSON.stringify(userInfo), {
      httpOnly: false, // Accessible to JS for Context
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: response.expiresIn / 1000,
      path: '/',
    });

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Credenciais inválidas ou erro no servidor.' };
  }

  // Redirect must be outside try/catch in Server Actions
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user_info');
  redirect('/login');
}
