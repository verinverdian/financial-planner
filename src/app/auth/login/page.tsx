'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const router = useRouter();

  // 🔄 Cek session setelah redirect login
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // kalau sudah login, langsung lempar ke dashboard
        router.replace('/dashboard');
      }
    };
    getSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // balik ke callback
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
    }
  };

  return (
    <>
      <head>
        <title>Login | Financial Tracking</title>
        <meta
          name="description"
          content="Masuk ke aplikasi Financial Tracking untuk mengelola keuangan Anda."
        />
      </head>

      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg space-y-6">
          {/* Login manual pakai email & password */}
          <AuthForm type="login" />

          {/* Kalau mau aktifkan Google login tinggal buka komentar */}
          {/* <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500">atau</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full px-4 py-2 flex items-center justify-center gap-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
            Login dengan Google
          </button> */}
        </div>
      </div>
    </>
  );
}
