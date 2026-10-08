import { useMemo } from 'react';
import { useLang } from './useLang';

/**
 * Menimpa item data dengan terjemahan English bila bahasa aktif `en`.
 *
 * Data asli di `src/data` tidak diubah bentuknya karena juga dipakai halaman
 * lain (ruang monitor, lampiran referensi). Terjemahan hanya menyimpan field
 * yang memang berbeda; sisanya — nama produk, teknologi, tautan — jatuh ke
 * data asli.
 */
export function useLocalized<T, K extends string | number>(
  items: T[],
  overlay: Partial<Record<K, Partial<T>>>,
  keyOf: (item: T) => K
): T[] {
  const { lang } = useLang();
  return useMemo(
    () => (lang === 'en' ? items.map((item) => ({ ...item, ...overlay[keyOf(item)] })) : items),
    // keyOf ditulis inline oleh pemanggil; menjadikannya dependensi akan
    // membuat memo ini tidak pernah berguna.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, items, overlay]
  );
}
