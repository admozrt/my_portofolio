import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../hooks/useLang';
import type { Lang } from '../../contexts/LanguageContext';

const OPTIONS: Lang[] = ['id', 'en'];

interface LangToggleProps {
  /** `zine` untuk halaman portofolio, `plain` untuk halaman institusional. */
  variant?: 'zine' | 'plain';
}

/**
 * Pil dua segmen ID / EN. Penanda pilihan aktif bergeser dengan layoutId,
 * jadi pindah bahasa terasa sebagai satu gerakan, bukan dua tombol berkedip.
 */
export const LangToggle: React.FC<LangToggleProps> = ({ variant = 'zine' }) => {
  const { lang, setLang, t } = useLang();
  const zine = variant === 'zine';

  return (
    <div
      role="radiogroup"
      aria-label={t.common.langLabel}
      className={`relative flex items-center rounded-full border p-0.5 ${
        zine
          ? 'border-zine-rule dark:border-zine-rule-dark'
          : 'border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800'
      }`}
    >
      {OPTIONS.map((option) => {
        const active = lang === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(option)}
            // Pil-nya sengaja ramping supaya muat di header bersama tombol
            // tema, tapi area sentuhnya diperluas lewat ::before sampai 45px —
            // tampilan tetap ringkas, jempol tetap gampang mengenai.
            className={`relative min-w-[34px] rounded-full px-2 py-1.5 before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] font-mono text-[11px] font-medium uppercase tracking-[0.06em] transition-colors ${
              active
                ? zine
                  ? 'text-zine-paper dark:text-zine-paper-dark'
                  : 'text-white dark:text-zinc-900'
                : zine
                  ? 'text-zine-ink-soft hover:text-zine-ink dark:text-zine-ink-soft-dark dark:hover:text-zine-ink-dark'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`langActive-${variant}`}
                aria-hidden="true"
                className={`absolute inset-0 rounded-full ${
                  zine ? 'bg-zine-pen dark:bg-zine-pen-dark' : 'bg-amber-600 dark:bg-amber-500'
                }`}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
};
