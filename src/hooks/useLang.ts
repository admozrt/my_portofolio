import { useContext } from 'react';
import { LanguageContext, type LanguageContextType } from '../contexts/LanguageContext';
import { ui } from '../i18n/ui';

export const useLang = (): LanguageContextType & { t: (typeof ui)['id'] } => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang harus digunakan dalam LanguageProvider');
  }
  return { ...context, t: ui[context.lang] };
};
