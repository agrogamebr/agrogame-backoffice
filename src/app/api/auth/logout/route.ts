import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');

  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user_info');

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error)}`);
  } else {
    redirect('/login');
  }
}
