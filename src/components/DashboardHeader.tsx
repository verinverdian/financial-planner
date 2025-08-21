"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      } else {
        setUserName(user?.email ?? "User");
      }
    };

    getUser();
  }, []);

  if (!show) return null;

  return (
    <div className="p-4 pb-0 shadow-sm relative">
      <div className="px-4 py-3 leading-normal bg-green-100 dark:bg-gray-800 dark:border-gray-900 rounded-lg border-2 border-green-400 flex justify-between items-start">
        <p>
          Halo 👋, selamat datang <span className="font-semibold">{userName}</span> di{" "}
          <span className="italic">tracking</span> keuangan kamu!
        </p>
        <button
          onClick={() => setShow(false)}
          className="ml-4 text-gray-600 hover:text-red-500"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
