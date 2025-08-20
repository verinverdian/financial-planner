'use client';

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from '@/components/LanguageToggle';
import Link from "next/link";
import LogoutButton from '@/components/LogoutButton';
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // cek user saat pertama kali load
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user); // bisa null atau User
    };
    checkUser();

    // listen perubahan auth (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-white flex justify-between items-center px-8 py-4">
      <Link href="/">
        <div className="text-2xl font-bold text-green-700">
          FinanceTrack Co.
        </div>
      </Link>
      
      <div className="hidden md:flex space-x-6 text-gray-700">
        <a href="/" className="hover:text-green-700">Home</a>
        <a href="/#features" className="hover:text-green-700">Features</a>
        <a href="/#pricing" className="hover:text-green-700">Pricing</a>
        <a href="/#about" className="hover:text-green-700">About</a>
      </div>
      
      <div className="flex justify-end">
        {user ? (
          <LogoutButton />
        ) : (
          <Link href="/auth/login">
            <button className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800">
              Get Started
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
