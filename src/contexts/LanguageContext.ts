import { createContext } from 'react';

export type Lang = 'id' | 'en';

export interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
