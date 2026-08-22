import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { partners } from '../../data/partner';
import { LIFT, REVEAL } from './motion';

/**
 * Instansi dan perusahaan yang pernah dikerjakan sistemnya.
 *
 * Datanya sama persis dengan yang dipakai halaman solusi digital lewat
 * `ReferenceAttachment` — satu sumber di `data/partner.ts`, tidak diduplikasi.
 * Yang berbeda cuma cara menggambarnya: di sana daftar bergaris rapi karena
 * halamannya memang bicara ke instansi, di sini kartu tertempel supaya
 * sebahasa dengan section lain di halaman ini.
 */

/** Kemiringan tetap per posisi, bukan acak: kalau diacak, susunannya berubah
 *  tiap kali halaman digambar ulang dan kartunya terlihat bergoyang sendiri. */
const TILT = [-1.4, 1.1, -0.8, 1.6, -1.2, 0.9, -1.7, 1.3, -1];

/** Data lama menyimpan '#' untuk mitra yang tidak punya situs. Tautan yang
 *  menuju '#' lebih buruk daripada tidak ada tautan: terlihat bisa diklik,
 *  lalu tidak melakukan apa-apa. */
const punyaSitus = (website?: string) => Boolean(website && website !== '#');

export const PartnerNotes: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="mitra" className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="mb-8 flex flex-wrap items-baseline justify-between gap-3"
      >
        <h2 className="np-hand text-[28px] text-zine-ink dark:text-zine-ink-dark sm:text-[36px]">
          Mitra &amp; Klien
        </h2>
        <p className="max-w-[38ch] text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
          Instansi dan perusahaan yang sistemnya saya kerjakan.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner, i) => {
          const tautan = punyaSitus(partner.website);

          const isi = (
            <>
              <span
                className={`np-tape ${i % 2 === 1 ? 'np-tape--cool' : ''}`}
                aria-hidden="true"
              />
              {i % 3 === 0 && <span className="np-pin" aria-hidden="true" />}

              <span className="flex items-start justify-between gap-2">
                <span className="np-hand text-[17px] leading-tight text-zine-ink dark:text-zine-ink-dark sm:text-[18.5px]">
                  {partner.name}
                </span>
                {tautan && (
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zine-pen dark:text-zine-pen-dark" />
                )}
              </span>

              <span className="mt-1.5 block font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.06em] text-zine-pen dark:text-zine-pen-dark">
                {partner.relationship}
              </span>

              {/* Panjang deskripsi di data beda jauh — yang terpanjang tiga kali
                  yang terpendek. Dipotong dua baris dengan tinggi minimum supaya
                  kartu dalam satu baris grid tidak timpang. */}
              <span className="mt-2 line-clamp-2 min-h-[2.6em] text-[13px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
                {partner.description}
              </span>
            </>
          );

          const kelas =
            'relative flex h-full flex-col border border-zine-rule bg-zine-card px-4 pb-4 pt-5 no-underline shadow-[0_3px_0_rgba(31,30,28,0.06)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_3px_0_rgba(0,0,0,0.25)]';

          return (
            <motion.div
              key={partner.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...REVEAL, delay: (i % 3) * 0.08 }}
              className="h-full"
            >
              {tautan ? (
                <motion.a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  animate={{ rotate: reduce ? 0 : TILT[i % TILT.length] }}
                  whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
                  transition={LIFT}
                  className={kelas}
                >
                  {isi}
                </motion.a>
              ) : (
                <motion.div
                  animate={{ rotate: reduce ? 0 : TILT[i % TILT.length] }}
                  whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
                  transition={LIFT}
                  className={kelas}
                >
                  {isi}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
