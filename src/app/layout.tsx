import "./globals.css";
import type { Metadata } from "next";
// import { ThemeProvider } from "next-themes";
// import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: "Financial Tracking | Kelola keuangan dengan mudah",
  description: "Masuk ke aplikasi Financial Tracking untuk mengelola keuangan Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
        {/* 
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </LanguageProvider>  
        */}
      </body>
    </html>
  );
}
