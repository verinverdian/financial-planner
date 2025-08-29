import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Tracking | Kelola keuangan dengan mudah",
  description: "Masuk ke aplikasi Financial Tracking untuk mengelola keuangan Anda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {children}
      </body>
    </html>
  );
}