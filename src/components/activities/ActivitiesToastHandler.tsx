'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/Toast';

export function ActivitiesToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToast } = useToast();
  const shownMessages = useRef<Set<string>>(new Set());

  useEffect(() => {
    const successMessage = searchParams.get('success');

    if (successMessage && !shownMessages.current.has(successMessage)) {
      shownMessages.current.add(successMessage);
      
      addToast(successMessage, 'success', 10000);

      // Remove the success param from URL without refreshing
      const params = new URLSearchParams(searchParams.toString());
      params.delete('success');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname, addToast]);

  return null;
}
