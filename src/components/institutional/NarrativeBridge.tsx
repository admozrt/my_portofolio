import React from 'react';
import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const NarrativeBridge: React.FC = () => {
  return (
    <section className="relative bg-black py-24 px-6 border-t border-zinc-800">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-xl sm:text-3xl font-medium leading-relaxed text-zinc-300"
        >
          Tapi hasil yang bagus saja tidak cukup. Untuk produk digital, semuanya
          harus bisa dipertanggungjawabkan.
        </motion.p>
      </div>
    </section>
  );
};
