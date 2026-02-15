'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';

export function ActivitiesToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToast();

  useEffect(() => {
    const successMessage = searchParams.get('success');

    if (successMessage) {
      addToast(successMessage, 'success');

      // Remove the success param from URL without refreshing
      const params = new URLSearchParams(searchParams.toString());
      params.delete('success');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname, addToast]);

  return null;
}
