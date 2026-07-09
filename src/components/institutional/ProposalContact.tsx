import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const ProposalContact: React.FC = () => {
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [need, setNeed] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Diskusi Proyek — ${institution || 'Instansi'}`);
    const body = encodeURIComponent(
      `Nama: ${name}\nInstansi: ${institution}\n\nKebutuhan Proyek:\n${need}`
    );
    window.location.href = `mailto:adrakhmat996@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="relative bg-stone-50 dark:bg-stone-900 py-20 px-6 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 mb-2">
            Ajukan Kerja Sama
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-800 dark:text-stone-100 mb-2">
            Ajukan Diskusi Proyek
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Estimasi respon: 1x24 jam
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1.5">
              Nama
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1.5">
              Instansi
            </label>
            <input
              id="institution"
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div>
            <label htmlFor="need" className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1.5">
              Kebutuhan Proyek
            </label>
            <textarea
              id="need"
              required
              rows={4}
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              className="w-full rounded-md border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-800 transition-colors"
          >
            <Send className="h-4 w-4" />
            Kirim melalui Email
          </button>
        </form>
      </div>
    </section>
  );
};
