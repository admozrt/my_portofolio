import React, { useEffect, useRef, useState } from 'react';
import { Monogram } from '../ui/Monogram';
import { useLang } from '../../hooks/useLang';

/**
 * Animasi pembuka /v2 (setara ZineSplash di portofolio v1), diceritakan
 * dengan bahasa halaman ini — rancang → bangun → rawat:
 *
 *   1. Lembar rancangan: nama dan monogram hanya garis tepi + label ukuran.
 *   2. Senter menyapu kiri → kanan; yang dilewati jadi versi bertinta.
 *   3. Cap "Berjalan" muncul.
 *   4. Senter membesar dari tengah dan melubangi lembar, memperlihatkan
 *      halaman di baliknya.
 *
 * Satu loop requestAnimationFrame mengatur variabel mask (--x --y --r --sx
 * --hole); React tidak dirender ulang per frame. Klik/ketuk/tombol apa pun
 * langsung loncat ke langkah 4.
 */

interface Props {
  onComplete?: () => void;
}

const T_SWEEP_START = 300;
const T_SWEEP_END = 1600;
const T_LIVE = 1600;
const T_OPEN = 1900;
const T_END = 2650;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const Sheet: React.FC<{ ink: boolean; live: boolean; liveLabel: string }> = ({ ink, live, liveLabel }) => (
  <div className={`v2-splash__sheet ${ink ? 'is-ink' : 'is-plan'}`} aria-hidden={!ink}>
    <div className="v2-splash__item">
      {!ink && <span className="v2-splash__spec">logo · 64</span>}
      {ink ? (
        <Monogram size={64} />
      ) : (
        <span className="v2-splash__logo-plan">A</span>
      )}
    </div>
    <div className="v2-splash__item">
      {!ink && <span className="v2-splash__spec">h1 · 36px</span>}
      <span className="v2-splash__name">Adi Rakhmatullah Ma'arif</span>
    </div>
    <span className="v2-splash__rule" />
    <div className="v2-splash__item">
      {!ink && <span className="v2-splash__spec">mono · 12px</span>}
      <span className="v2-splash__role">Software Engineer</span>
    </div>
    {ink && (
      <span className={`v2-live v2-splash__live${live ? ' is-on' : ''}`}>
        <i />
        {liveLabel}
      </span>
    )}
  </div>
);

export const V2Splash: React.FC<Props> = ({ onComplete }) => {
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const [live, setLive] = useState(false);
  const [gone, setGone] = useState(false);
  // Disimpan di ref: fungsi baru dari induk tidak boleh memulai ulang animasi.
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.style.overflow = prevOverflow;
      setGone(true);
      doneRef.current?.();
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      stage.style.setProperty('--sx', '9999px');
      setLive(true);
      const a = window.setTimeout(() => root.classList.add('is-fading'), 500);
      const b = window.setTimeout(finish, 750);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
        document.body.style.overflow = prevOverflow;
      };
    }

    let raf = 0;
    let start = performance.now();
    let liveShown = false;
    const holeMax = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40;

    const frame = (now: number) => {
      const el = now - start;
      const { width: W, height: H } = stage.getBoundingClientRect();
      const R = Math.max(70, Math.min(130, W * 0.22));

      // 2. Sapuan senter
      const p = Math.min(1, Math.max(0, (el - T_SWEEP_START) / (T_SWEEP_END - T_SWEEP_START)));
      const e = easeInOut(p);
      const x = -R + e * (W + 2 * R);
      const y = H * (0.5 + Math.sin(e * Math.PI * 2) * 0.16);
      const r = el < T_SWEEP_START ? 0 : el < T_OPEN ? R : Math.max(0, R * (1 - (el - T_OPEN) / 200));
      stage.style.setProperty('--x', `${x}px`);
      stage.style.setProperty('--y', `${y}px`);
      stage.style.setProperty('--r', `${r}px`);
      // Bekas sapuan tetap bertinta: semua yang sudah dilewati senter.
      stage.style.setProperty('--sx', p >= 1 ? '9999px' : `${x - R * 0.55}px`);

      // 3. Cap "Berjalan"
      if (!liveShown && el >= T_LIVE) {
        liveShown = true;
        setLive(true);
      }

      // 4. Senter membuka halaman
      const q = Math.min(1, Math.max(0, (el - T_OPEN) / (T_END - T_OPEN)));
      root.style.setProperty('--hole', `${easeInOut(q) * holeMax}px`);

      if (el >= T_END) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    // Pengaman: kalau loop animasi tidak berjalan (frame tidak digambar),
    // lembar tetap dilepas supaya halaman tidak tertutup selamanya.
    const safety = window.setTimeout(finish, T_END + 2500);

    skipRef.current = () => {
      const now = performance.now();
      if (now - start < T_OPEN) start = now - T_OPEN;
    };
    const onKey = () => skipRef.current();
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="v2-splash" onPointerDown={() => skipRef.current()} role="presentation">
      <div ref={stageRef} className="v2-splash__stage">
        <Sheet ink={false} live={false} liveLabel={t.v2.live} />
        <Sheet ink live={live} liveLabel={t.v2.live} />
      </div>
    </div>
  );
};
