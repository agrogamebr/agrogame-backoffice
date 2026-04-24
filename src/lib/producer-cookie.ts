import { cookies } from 'next/headers';

const COOKIE_NAME = 'selected_producer';

export interface SelectedProducer {
  userId: string;
  name: string;
  status: string;
}

export async function setSelectedProducer(producer: SelectedProducer): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(producer), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hora
  });
}

export async function getSelectedProducer(): Promise<SelectedProducer | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  try {
    return JSON.parse(cookie.value) as SelectedProducer;
  } catch {
    return null;
  }
}
