'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth callback error:', error.message);
      } else if (data.session) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return <p className="text-center mt-10">Logging you in...</p>;
}
