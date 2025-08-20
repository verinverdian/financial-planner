'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/auth/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return <>{children}</>;
}
