import React from 'react';
import { complianceCards } from '../../data/complianceCards';
import { ComplianceCard } from './ComplianceCard';

export const ComplianceSection: React.FC = () => {
  return (
    <section className="relative bg-stone-50 dark:bg-stone-900 py-20 px-6 border-t-4 border-double border-stone-300 dark:border-stone-700">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 mb-2">
            Dokumen Kompetensi
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-800 dark:text-stone-100">
            Certified &amp; Sealed
          </h2>
          <p className="mt-2 text-stone-500 dark:text-stone-400">
            Kredibilitas, keamanan, dan kepatuhan bukan klaim kosong — ini yang benar-benar diterapkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {complianceCards.map((card, i) => (
            <ComplianceCard key={card.referenceNumber} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
