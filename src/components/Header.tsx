import ThemeToggle from "./ThemeToggle";
import LanguageToggle from '@/components/LanguageToggle';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
      <h1 className="text-xl font-bold">💰 Financial Tracking</h1>
      <div className="flex flex-end">
        <span className="mr-4"><ThemeToggle/></span>
        <LanguageToggle />
      </div>
    </header>
  );
}
