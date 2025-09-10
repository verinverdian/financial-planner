'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "@headlessui/react";
import { Bell, Download, User as UserIcon, LogOut } from "lucide-react";
import Image from "next/image";

const getLastTrackingDate = async (userId: string | undefined) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("trackings")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data?.created_at ? new Date(data.created_at) : null;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const monthName = new Date().toLocaleString("id-ID", { month: "long" });


  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user?.id) {
        const lastTracking = await getLastTrackingDate(data.user.id);
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
        const seenNotification = localStorage.getItem(`seenNotification-${monthKey}`);

        if ((!lastTracking || lastTracking < new Date(now.getFullYear(), now.getMonth(), 1)) && !seenNotification) {
          setShowNotification(true);
        }
      }
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleBellClick = () => {
    setShowPopup(!showPopup);
    setShowNotification(false);

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    localStorage.setItem(`seenNotification-${monthKey}`, "true");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${isScrolled ? "bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700" : "bg-transparent"}
      `}
    >
      <div className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold text-green-700">FinanceTrack Co.</div>
        </Link>

        {/* Menu home */}
        {pathname === "/" && (
          <div className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-200">
            <Link href="/" className="hover:text-green-700 dark:hover:text-green-400">Home</Link>
            <Link href="/#features" className="hover:text-green-700 dark:hover:text-green-400">Features</Link>
            <Link href="/#pricing" className="hover:text-green-700 dark:hover:text-green-400">Pricing</Link>
            <Link href="/#about" className="hover:text-green-700 dark:hover:text-green-400">About</Link>
          </div>
        )}

        {/* Aksi kanan */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Tombol Notifikasi */}
          {pathname === "/dashboard" && (
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                aria-label="Notifications"
                onClick={handleBellClick}
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {showNotification && (
                  <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Popup Notifikasi */}
              {showPopup && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-green-500 rounded-lg shadow-lg p-4 z-50">
                  <p className="text-gray-800 dark:text-gray-200">
                    Jangan lupa melakukan tracking bulan ini ({monthName})!
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => setShowPopup(false)}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>)}

          {/* Tombol Export */}
          {pathname === "/dashboard" && (
            <div className="relative">
              <Menu>
                <Menu.Button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 bg-white border border-green-500 dark:bg-gray-800 shadow-lg rounded-lg p-2 z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`block px-4 py-2 w-full text-left ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                      >
                        Export PDF
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`block px-4 py-2 w-full text-left ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                      >
                        Export Excel
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          )}

          {/* Avatar User */}
          {user ? (
            <div className="relative">
              <Menu>
                <Menu.Button className="flex items-center space-x-2">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                    />
                  ) : user.user_metadata?.full_name ? (
                    <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-green-600 text-white font-semibold">
                      {user.user_metadata.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    </div>
                  )}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-40 z-50 border border-green-500">
                  {pathname === "/" && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`flex items-center gap-2 px-4 py-2 ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                        >
                          <UserIcon className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>)}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`flex items-center gap-2 px-4 py-2 ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                      >
                        <UserIcon className="w-4 h-4" />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-left ${active ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          ) : (
            <Link href="/auth/login">
              <button className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}