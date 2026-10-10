import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext, type Lang } from '../../contexts/LanguageContext';

/** Alamat yang punya padanan English di bawah `/en`. Halaman lain tetap hanya
 *  Bahasa Indonesia, jadi tombol bahasa tidak boleh mengarah ke `/en/...`-nya. */
const BILINGUAL = ['/', '/solusi-digital'];

/** Halaman berdiri sendiri yang mengatur `<html lang>`-nya sendiri lewat
 *  tombol bahasa lokal (bukan lewat alamat `/en`). */
const OWN_LANG = ['/rekomendasyi'];

const stripEn = (pathname: string) => pathname.replace(/^\/en(?=\/|$)/, '') || '/';

/**
 * Bahasa ditentukan oleh ALAMAT, bukan disimpan di localStorage.
 *
 * Itu yang membuat versi English bisa terindeks: Googlebot datang tanpa
 * localStorage, mendarat di `/en`, dan langsung merender English. Kalau bahasa
 * disimpan di peramban, Google hanya pernah melihat versi Indonesia.
 *
 * Sengaja tidak ada pengalihan otomatis berdasarkan pilihan sebelumnya atau
 * bahasa peramban — Googlebot bisa ikut teralihkan, dan versi Indonesia malah
 * hilang dari indeks.
 *
 * Harus dipasang DI DALAM <Router>, karena membaca dan mengubah alamat.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const lang: Lang = /^\/en(\/|$)/.test(pathname) ? 'en' : 'id';

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return;
      const base = stripEn(pathname);
      if (!BILINGUAL.includes(base)) return;
      const target = next === 'en' ? (base === '/' ? '/en' : `/en${base}`) : base;
      // Hash ikut dibawa: /#projek <-> /en#projek tetap mendarat di section yang sama.
      navigate(target + hash);
    },
    [lang, pathname, hash, navigate]
  );

  // Dibaca pembaca layar dan fitur terjemahan otomatis peramban.
  React.useEffect(() => {
    if (OWN_LANG.includes(pathname.replace(/\/$/, ''))) return;
    document.documentElement.lang = lang;
  }, [lang, pathname]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};
