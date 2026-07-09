import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Monogram } from '../ui/Monogram';
import { ThemeToggle } from '../layout/ThemeToggle';

export const InstitutionalHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Monogram size={32} strokeClassName="stroke-amber-600 dark:stroke-amber-500" />
          <span className="hidden text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:block">
            Adi R. Ma'arif
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Portofolio</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
