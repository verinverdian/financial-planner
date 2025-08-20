'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded transition-colors duration-200 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
        >
            {language === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}
        </button>
    );
}
