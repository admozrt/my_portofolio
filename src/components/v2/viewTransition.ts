import { flushSync } from 'react-dom';

/**
 * Transisi pergantian tema dan bahasa di /v2 memakai View Transitions API:
 * browser memotret halaman lama dan baru, lalu CSS di v2.css menganimasikan
 * potretnya (`html[data-v2vt=…]::view-transition-new(root)`):
 *
 *   theme → lingkaran "senter" membesar dari titik klik
 *   lang  → halaman baru tersapu dari kiri ke kanan
 *
 * Tanpa dukungan browser atau dengan prefers-reduced-motion, perubahan
 * langsung diterapkan tanpa animasi.
 */

type Kind = 'theme' | 'lang';

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export const runTransition = (kind: Kind, apply: () => void, origin?: { x: number; y: number }) => {
  const doc = document as DocWithVT;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!doc.startViewTransition || reduce) {
    apply();
    return;
  }
  const root = document.documentElement;
  root.dataset.v2vt = kind;
  if (origin) {
    root.style.setProperty('--vt-x', `${origin.x}px`);
    root.style.setProperty('--vt-y', `${origin.y}px`);
  }
  // flushSync: DOM baru harus sudah jadi saat callback selesai, supaya potret
  // "sesudah" benar-benar berisi tema/bahasa baru.
  const vt = doc.startViewTransition(() => flushSync(apply));
  vt.finished.finally(() => {
    delete root.dataset.v2vt;
  });
};
