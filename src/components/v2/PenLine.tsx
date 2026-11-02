import React, { useEffect, useMemo, useState } from 'react';
import { useLang } from '../../hooks/useLang';

/**
 * Garis pena: satu garis tinta di tepi kiri layar yang tergambar mengikuti
 * gulir, dengan simpul per section yang menyala saat dilewati. Berfungsi
 * sebagai penanda kemajuan baca sekaligus navigasi (simpul bisa diketuk).
 *
 * Murah: satu path SVG dengan `pathLength=1`, yang berubah hanya
 * `stroke-dashoffset`. Pengukuran posisi section diulang saat ukuran halaman
 * berubah (gambar dimuat, detail projek dibuka), bukan tiap frame.
 */

interface Props {
  sections: { id: string; label: string }[];
}

const TOP = 84; // di bawah header
const BOTTOM = 28;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export const PenLine: React.FC<Props> = ({ sections }) => {
  const { t } = useLang();
  const [progress, setProgress] = useState(0);
  const [marks, setMarks] = useState<number[]>([]);
  const [vh, setVh] = useState(() => (typeof window === 'undefined' ? 800 : window.innerHeight));

  useEffect(() => {
    let raf = 0;
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const measure = () => {
      setVh(window.innerHeight);
      const max = maxScroll();
      setMarks(
        sections.map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return 0;
          // Simpul menyala saat section mencapai sepertiga atas layar.
          const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35;
          return clamp(top / max);
        })
      );
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setProgress(clamp(window.scrollY / maxScroll()));
      });
    };
    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [sections]);

  const len = Math.max(120, vh - TOP - BOTTOM);
  /* Garis sedikit bergelombang supaya terbaca sebagai goresan pena, bukan
     scrollbar. */
  const d = useMemo(() => {
    let path = 'M 10 0';
    for (let y = 16; y <= len; y += 16) path += ` L ${(10 + Math.sin(y / 46) * 2.2).toFixed(2)} ${y}`;
    return path;
  }, [len]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <nav className="v2-pen" aria-label={t.v2.progress} style={{ top: TOP, height: len }}>
      <svg className="v2-pen__svg" width="20" height={len} viewBox={`0 0 20 ${len}`} aria-hidden="true">
        <path d={d} className="v2-pen__track" pathLength={1} />
        <path d={d} className="v2-pen__ink" pathLength={1} style={{ strokeDashoffset: 1 - progress }} />
      </svg>
      {sections.map((s, i) => {
        const at = marks[i] ?? 0;
        const on = progress >= at - 0.002;
        return (
          <button
            key={s.id}
            type="button"
            className={`v2-pen__node${on ? ' is-on' : ''}`}
            style={{ top: at * len }}
            onClick={() => go(s.id)}
            aria-label={s.label}
          >
            <span className="v2-pen__dot" />
            <span className="v2-pen__label">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
