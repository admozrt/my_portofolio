import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ComplianceCard as ComplianceCardData } from '../../data/complianceCards';

const stampColor: Record<ComplianceCardData['stampLabel'], string> = {
  IMPLEMENTED: 'text-emerald-700 border-emerald-700 dark:text-emerald-400 dark:border-emerald-400',
  COMPLIANT: 'text-amber-700 border-amber-700 dark:text-amber-400 dark:border-amber-400',
  SECURED: 'text-red-700 border-red-700 dark:text-red-400 dark:border-red-400',
};

export const ComplianceCard: React.FC<{ card: ComplianceCardData; index: number }> = ({ card, index }) => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotate: -1 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
      className="rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100">{card.title}</h3>
        <span
          className={`shrink-0 rounded border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${stampColor[card.stampLabel]}`}
          style={{ transform: 'rotate(-4deg)' }}
        >
          {card.stampLabel}
        </span>
      </div>

      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-3">{card.shortDescription}</p>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
        aria-expanded={open}
      >
        Detail teknis
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 leading-relaxed border-t border-stone-200 dark:border-stone-700 pt-3">
            {card.detailDescription}
          </p>
        </motion.div>
      )}

      <div className="mt-4 border-t border-dashed border-stone-300 dark:border-stone-700 pt-2 font-mono text-[10px] text-stone-400 dark:text-stone-500">
        Ref: {card.referenceNumber}
      </div>
    </motion.div>
  );
};
