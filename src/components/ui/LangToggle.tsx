import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../hooks/useLang';
import type { Lang } from '../../contexts/LanguageContext';

const OPTIONS: Lang[] = ['id', 'en'];

/*
  Bendera digambar sebagai SVG inline, bukan emoji: emoji bendera tidak tampil
  di Windows — yang muncul hanya huruf "ID" dan "GB".

  Keduanya dipotong ke rasio 7:5 supaya sama besar di dalam tombol, walau
  rasio aslinya berbeda (Indonesia 3:2, Inggris 2:1).
*/
const FlagID: React.FC = () => (
  <svg viewBox="0 0 7 5" className="block h-full w-full" aria-hidden="true">
    <rect width="7" height="2.5" fill="#CE1126" />
    <rect y="2.5" width="7" height="2.5" fill="#FFFFFF" />
  </svg>
);

const FlagUK: React.FC = () => {
  // Id clipPath harus unik per instans, atau dua bendera di satu halaman saling
  // memakai klip milik yang lain.
  const uid = useId().replace(/:/g, '');
  return (
    // viewBox dipotong ke tengah bendera 60x30 dengan rasio 7:5 (42x30).
    <svg viewBox="9 0 42 30" className="block h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id={`uk-t-${uid}`}>
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
      </defs>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#uk-t-${uid})`}
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
};

const FLAGS: Record<Lang, React.FC> = { id: FlagID, en: FlagUK };

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
            <span className="relative flex items-center gap-1.5">
              {/* Garis tepi tipis wajib: tanpa itu separuh putih bendera
                  Indonesia lenyap di atas latar kertas yang terang. */}
              <span
                className={`block h-[10px] w-[14px] shrink-0 overflow-hidden rounded-[2px] ring-1 ${
                  active ? 'ring-white/50' : 'ring-black/15 dark:ring-white/25'
                }`}
              >
                {React.createElement(FLAGS[option])}
              </span>
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};
