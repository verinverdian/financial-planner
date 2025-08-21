'use client';

import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
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
