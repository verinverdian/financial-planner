"use client";

import "./globals.css";
import type { Metadata } from "next";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

// export const metadata: Metadata = {
//   title: "Financial Tracking | Kelola keuangan dengan mudah",
//   description: "Masuk ke aplikasi Financial Tracking untuk mengelola keuangan Anda.",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <SessionContextProvider supabaseClient={supabase}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
