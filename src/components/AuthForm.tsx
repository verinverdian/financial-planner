'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔹 validasi realtime confirm password
  useEffect(() => {
    if (type === 'signup' && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError('Password dan Confirm Password tidak sama');
      } else {
        setPasswordError(null);
      }
    }
  }, [password, confirmPassword, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (type === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push('/dashboard');
    } else {
      if (password !== confirmPassword) {
        setPasswordError('Password dan Confirm Password tidak sama');
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else router.push('/auth/confirm-email'); // ke halaman confirm email
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) setError(error.message);
  };

  // 🔹 disable tombol kalau input kosong atau ada error
  const isDisabled =
    !email ||
    !password ||
    (type === 'signup' && (!confirmPassword || passwordError !== null));

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      <Link href="/">
        <div className="text-center text-2xl font-bold text-green-700">
          FinanceTrack Co.
        </div>
      </Link>
      <form onSubmit={handleSubmit} className="space-y-2">
        <h1 className="font-bold text-green-600">
          {type === 'login' ? 'Login' : 'Sign Up'}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 pr-10 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password (hanya untuk signup) */}
        {type === 'signup' && (
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 pr-10 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {/* Error Messages */}
        {passwordError && (
          <p className="mt-1 text-red-500 text-sm">{passwordError}</p>
        )}
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-2 rounded text-white ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <Link href={type === 'login' ? '/auth/signup' : '/auth/login'}>
        <div className="mt-2 text-center text-sm text-gray-500 hover:text-green-600">
          {type === 'login'
            ? 'Belum punya akun? Daftar disini'
            : 'Sudah punya akun? Login disini'}
        </div>
      </Link>

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-grow border-t"></div>
        <span className="px-2 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100"
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}
