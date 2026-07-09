import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useBeep } from '../../hooks/useBeep';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const { playBoot, playBeep } = useBeep();

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      playBoot();
    } else {
      playBeep();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-3 py-2 text-zinc-500 dark:text-zinc-400 hover:border-ops-600 hover:text-ops-600 dark:hover:text-ops-400 transition-colors shadow-lg"
      aria-label={enabled ? 'Matikan suara' : 'Nyalakan suara'}
      title={enabled ? 'Suara aktif' : 'Suara nonaktif'}
    >
      {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      <span className="font-mono text-[10px] uppercase tracking-wide hidden sm:inline">
        {enabled ? 'Sound On' : 'Sound Off'}
      </span>
    </button>
  );
};
