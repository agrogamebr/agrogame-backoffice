'use server';

import { redirect } from 'next/navigation';
import { setSelectedProducer } from '@/lib/producer-cookie';

export async function selectProducerAction(
  userId: string,
  name: string,
  status: string,
): Promise<void> {
  await setSelectedProducer({ userId, name, status });
  redirect('/users/detail');
}

export async function selectProducerForExtratoAction(
  userId: string,
  name: string,
  status: string,
): Promise<void> {
  await setSelectedProducer({ userId, name, status });
  redirect('/users/detail/extrato');
}
