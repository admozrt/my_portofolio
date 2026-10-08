import { useCallback, useContext } from 'react';
import { LanguageContext, type LanguageContextType } from '../contexts/LanguageContext';
import { ui } from '../i18n/ui';

export const useLang = (): LanguageContextType & {
  t: (typeof ui)['id'];
  /** Menambahkan awalan `/en` saat English aktif. Hanya untuk tautan ke halaman
   *  yang memang punya versi English (`/` dan `/solusi-digital`). */
  localePath: (path: string) => string;
} => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang harus digunakan dalam LanguageProvider');
  }
  const { lang } = context;
  const localePath = useCallback(
    (path: string) => {
      if (lang !== 'en') return path;
      // "/" dan "/#projek" jadi "/en" dan "/en#projek", bukan "/en/#projek".
      if (path === '/' || path.startsWith('/#')) return '/en' + path.slice(1);
      return '/en' + path;
    },
    [lang]
  );
  return { ...context, t: ui[lang], localePath };
};
