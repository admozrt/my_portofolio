import React, { useEffect, useState } from 'react';
import { LanguageContext, type Lang } from '../../contexts/LanguageContext';

const KEY = 'lang';

/**
 * Bahasa antarmuka portofolio.
 *
 * Dipasang sekali di App, bukan per halaman seperti ThemeProvider, supaya
 * pilihan bahasa ikut terbawa saat pindah dari `/` ke `/solusi-digital`.
 *
 * Bawaannya `id`, sengaja tidak mendeteksi bahasa peramban: banyak pengunjung
 * Indonesia memakai OS berbahasa Inggris, dan deteksi otomatis akan menyajikan
 * English ke audiens utama situs ini sendiri.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem(KEY) === 'en' ? 'en' : 'id';
    } catch {
      return 'id';
    }
  });

  useEffect(() => {
    // Dibaca pembaca layar dan fitur terjemahan otomatis peramban.
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* mode privat: pilihan tetap berlaku selama halaman terbuka */
    }
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};
