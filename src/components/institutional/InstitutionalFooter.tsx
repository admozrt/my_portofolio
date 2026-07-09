import React from 'react';
import { Link } from 'react-router-dom';
import { contactInfo } from '../../data/contact';

export const InstitutionalFooter: React.FC = () => {
  return (
    <footer className="border-t border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 py-10 text-stone-500 dark:text-stone-400">
      <div className="container mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center">
        <p className="text-sm">
          Adi Rakhmatullah Ma'arif, S.Kom — Software Engineer
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          {contactInfo.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              {c.label}: {c.text}
            </a>
          ))}
        </div>
        <Link to="/" className="text-xs text-stone-400 dark:text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
          &larr; Kembali ke Portofolio
        </Link>
        <p className="text-xs text-stone-400 dark:text-stone-500">
          &copy; {new Date().getFullYear()} Adi Rakhmatullah Ma'arif
        </p>
      </div>
    </footer>
  );
};
