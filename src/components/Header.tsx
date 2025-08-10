'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">💰 Financial Planner</h1>
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
        </header>
    );
}
