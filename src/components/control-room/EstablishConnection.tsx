import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { contactInfo } from '../../data/contact';

export const EstablishConnection: React.FC = () => {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel((c) => (c === label ? null : c)), 1800);
  };

  return (
    <section id="kontak" className="relative bg-zinc-50 dark:bg-zinc-950 py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-40 sm:w-48 aspect-[3/4] mx-auto mb-8 rounded-xl overflow-hidden border border-ops-600/60 dark:border-ops-500/50 shadow-xl shadow-ops-600/10 dark:shadow-ops-500/10"
        >
          <img
            src="/my.png"
            alt="Adi Rakhmatullah Ma'arif"
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </motion.div>

        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
          Buka Saluran Komunikasi
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white mb-3">Establish Connection</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Ada sistem yang ingin dibangun atau dibenahi? Kirim sinyal.
        </p>
        <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600 mb-10">Response Time: &lt; 24 hours</p>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 divide-y divide-zinc-200 dark:divide-zinc-800 text-left">
          {contactInfo.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ops-600 dark:text-ops-500">
                  {c.label}
                </div>
                <div className="text-sm text-zinc-800 dark:text-zinc-200 truncate">{c.text}</div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(c.label, c.text)}
                className="shrink-0 p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-ops-600 dark:hover:text-ops-400 hover:border-ops-600 transition-colors"
                aria-label={`Salin ${c.label}`}
              >
                {copiedLabel === c.label ? (
                  <Check className="w-4 h-4 text-ops-600 dark:text-ops-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
