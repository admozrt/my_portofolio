import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import type { ThemeProviderProps } from '../../types';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
/**
 * Tema gelap paksa untuk halaman yang memang dirancang gelap (/solusi-digital).
 * Kelas `dark` dipasang sebelum layar pertama digambar (useLayoutEffect) supaya
 * tidak berkedip terang, dan dikembalikan ke pilihan tersimpan pengunjung saat
 * halaman ditinggalkan — pilihan itu sendiri tidak diubah.
 */
export const ForcedDarkTheme: React.FC<ThemeProviderProps> = ({ children }) => {
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    return () => {
      root.classList.toggle('dark', localStorage.getItem('theme') === 'dark');
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark: true, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};
