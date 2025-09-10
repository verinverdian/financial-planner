"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        setUserName(user?.email ?? "Admin Pabrik");
      }
    };

    getUser();
  }, []);

  return (
    <div className="p-4 pb-0 relative">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="px-5 py-4 bg-white dark:bg-gray-800 
                       rounded-lg border border-green-500 dark:border-gray-700 
                       flex justify-between items-center shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="animate-wiggle">👋</span>
              <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                Hai <span className="font-semibold">{userName}</span>, senang melihatmu kembali! Yuk cek laporan keuanganmu hari ini 💰
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="ml-4 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animasi custom untuk tangan 👋 */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(15deg); }
        }
        .animate-wiggle {
          display: inline-block;
          animation: wiggle 1s ease-in-out infinite;
          transform-origin: bottom right;
        }
      `}</style>
    </div>
  );
}
