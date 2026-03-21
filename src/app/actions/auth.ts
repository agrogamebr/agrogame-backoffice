'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login, User, changePassword } from '@/services/auth.service';

export interface AuthState {
  errors?: {
    identifier?: string;
    password?: string;
    general?: string;
  };
  success?: boolean;
  identifier?: string;
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  const errors: AuthState['errors'] = {};

  if (!identifier) {
    errors.identifier = 'Informe seu login.';
  }

  if (!password) {
    errors.password = 'Informe sua senha.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, identifier };
  }

  try {
    const response = await login({ identifier, password });

    const cookieStore = await cookies();

    cookieStore.set('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: response.expiresIn / 1000,
      path: '/',
    });

    const userInfo: User = {
      userId: response.userId,
      email: response.email,
      name: response.name,
      userType: response.userType,
    };

    cookieStore.set('user_info', JSON.stringify(userInfo), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: response.expiresIn / 1000,
      path: '/',
    });

    // Se forceChangePassword for true, marca o cookie e redireciona para change-password
    if (response.forceChangePassword) {
      cookieStore.set('force_change_password', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: response.expiresIn / 1000,
        path: '/',
      });
      redirect('/change-password');
    }

  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Login error:', err);
    return {
      errors: {
        general: err.message || 'Credenciais inválidas ou erro no servidor.'
      },
      identifier
    };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user_info');
  cookieStore.delete('force_change_password');
  redirect('/login');
}

export interface ChangePasswordState {
  success?: boolean;
  error?: string;
}

export async function changePasswordAction(
  formData: FormData
): Promise<ChangePasswordState> {
  const newPassword = formData.get('newPassword') as string;

  if (!newPassword) {
    return { error: 'Por favor, informe a nova senha.' };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { error: 'Sessão expirada. Por favor, faça login novamente.' };
    }

    await changePassword(token, newPassword);

    // Remove o cookie de mudança de senha forçada
    cookieStore.delete('force_change_password');

    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Change password error:', err);
    return {
      error: err.message || 'Erro ao alterar senha. Tente novamente.',
    };
  }
}
