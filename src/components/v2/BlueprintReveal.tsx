import React, { useEffect, useRef } from 'react';

/**
 * Senter blueprint: dua lapisan bertumpuk — rancangan di bawah, produk jadi
 * di atas. Lingkaran "senter" melubangi lapisan produk sehingga rancangannya
 * terlihat.
 *
 * - Mouse/pena: senter mengikuti kursor, hilang saat kursor keluar.
 * - Layar sentuh: jari menutupi area yang disingkap, jadi saat panel pertama
 *   kali terlihat senter menyapu sendiri dari kiri ke kanan; setelah itu bisa
 *   diseret jari (gulir vertikal tetap jalan: `touch-action: pan-y`).
 *
 * Posisi senter hanya mengubah variabel CSS di elemen ini — tidak ada render
 * ulang React per gerakan.
 */

export type RevealMode = 'reveal' | 'blueprint' | 'product';

interface Props {
  blueprint: React.ReactNode;
  product: React.ReactNode;
  /** `blueprint` = rancangan penuh, `product` = produk penuh, `reveal` = senter. */
  mode?: RevealMode;
  className?: string;
  ariaLabel?: string;
}

const RADIUS = 92;

export const BlueprintReveal: React.FC<Props> = ({ blueprint, product, mode = 'reveal', className = '', ariaLabel }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const swept = useRef(false);

  const place = (x: number, y: number, r: number) => {
    const el = boxRef.current;
    if (!el) return;
    el.style.setProperty('--v2x', `${x}px`);
    el.style.setProperty('--v2y', `${y}px`);
    el.style.setProperty('--v2r', `${r}px`);
  };

  const fromEvent = (e: React.PointerEvent) => {
    if (mode !== 'reveal') return;
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    place(e.clientX - r.left, e.clientY - r.top, RADIUS);
  };

  /* Sapuan otomatis di layar sentuh, sekali saat panel pertama kali terlihat. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el || mode !== 'reveal') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!coarse || reduce || swept.current) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || swept.current) return;
        swept.current = true;
        io.disconnect();
        const { width, height } = el.getBoundingClientRect();
        const start = performance.now();
        const D = 1600;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / D);
          const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const x = -RADIUS + ease * (width + RADIUS * 2);
          const y = height * (0.35 + Math.sin(t * Math.PI) * 0.25);
          place(x, y, t < 0.9 ? RADIUS + 18 : (RADIUS + 18) * (1 - (t - 0.9) * 10));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  return (
    <div
      ref={boxRef}
      className={`v2-reveal v2-reveal--${mode} ${className}`}
      onPointerMove={fromEvent}
      onPointerDown={fromEvent}
      onPointerLeave={() => place(-999, -999, 0)}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="v2-reveal__layer v2-reveal__blueprint" aria-hidden="true">
        {blueprint}
      </div>
      <div className="v2-reveal__layer v2-reveal__product" aria-hidden="true">
        {product}
      </div>
    </div>
  );
};
