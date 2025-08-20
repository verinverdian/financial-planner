"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // cegah mismatch SSR

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 rounded transition-colors duration-200 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
        >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

    );
}
