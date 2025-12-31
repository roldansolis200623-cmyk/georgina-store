'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('georgina-theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.state?.theme) {
          setTheme(parsed.state.theme);
        }
      } catch (e) {
        console.error('Error parsing theme:', e);
      }
    }
  }, [setTheme]);

  if (!mounted) {
    return (
      <button
        className="relative p-2 rounded-full bg-light-grey hover:bg-secondary/10 transition-colors"
        aria-label="Toggle theme"
      >
        <Moon className="w-5 h-5 text-primary" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-light-grey dark:bg-dark-grey hover:bg-secondary/10 dark:hover:bg-secondary/20 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-primary dark:text-white" />
        ) : (
          <Sun className="w-5 h-5 text-primary dark:text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}
