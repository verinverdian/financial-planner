import "./globals.css";
// import { ThemeProvider } from "next-themes";
// import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Financial Tracking</title>
      </head>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}

        {/* <LanguageProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        </LanguageProvider>  */}
      </body>
    </html>

  );
}
