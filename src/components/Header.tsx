import ThemeToggle from "./ThemeToggle";
import LanguageToggle from '@/components/LanguageToggle';
import Link from "next/link";


export default function Header() {
  return (
    <header className="bg-white flex justify-between items-center px-8 py-4">
      <Link href="/">
        <div className="text-2xl font-bold text-green-700">
          FinanceTrack Co.
        </div>
      </Link>
      <div className="hidden md:flex space-x-6 text-gray-700">
        <a href="/" className="hover:text-green-700">Home</a>
        <a href="/dashboard" className="hover:text-green-700">Features</a>
        <a href="/#pricing" className="hover:text-green-700">Pricing</a>
        <a href="/#about" className="hover:text-green-700">About</a>
      </div>
      <Link href="/dashboard">
        <button className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800">
          Get Started
        </button>
      </Link>
    </header>
  );
}
