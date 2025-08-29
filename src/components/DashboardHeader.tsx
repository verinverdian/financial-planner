"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, PartyPopper } from "lucide-react";
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
        setUserName(user?.email ?? "User");
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
            className="px-5 py-4 bg-gradient-to-r from-green-200 via-green-300 to-green-500 
                       dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 
                       rounded-xl border border-green-400 
                       flex justify-between items-center shadow-xl backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <PartyPopper className="text-green-700 dark:text-yellow-300 animate-pulse" size={22} />
              <p className="text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                Halo <span className="inline-block animate-wiggle">👋</span>, selamat datang{" "}
                <span className="font-bold text-green-800 dark:text-green-300 underline decoration-yellow-400">
                  {userName}
                </span>{" "}
                di <span className="italic">tracking</span> keuangan kamu!
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="ml-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
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
