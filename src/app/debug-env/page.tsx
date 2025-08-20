'use client';

export default function DebugEnv() {
  return (
    <div>
      <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NOT FOUND'}</p>
      <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ NOT FOUND'}</p>
    </div>
  );
}
