import React, { useState } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../../types';

const statusColor: Record<Project['monitorStatus'], string> = {
  LIVE: 'bg-ops-500',
  OPERATIONAL: 'bg-ops-600',
  STANDBY: 'bg-amber-500',
};

// Small decorative looping "live data" line chart — purely visual, not real telemetry.
const MiniChart: React.FC<{ seed: number }> = ({ seed }) => {
  const points = Array.from({ length: 10 }, (_, i) => {
    const n = Math.sin(seed + i * 1.3) * 8 + Math.cos(seed * 0.7 + i) * 6;
    return 16 + n;
  });
  const path = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100} ${y}`)
    .join(' ');
  return (
    <svg viewBox="0 0 100 32" className="w-full h-8 text-ops-600/70 dark:text-ops-500/70" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const MonitorCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="monitor-card group relative text-left rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 flex flex-col gap-3 hover:border-ops-600 transition-colors shadow-sm dark:shadow-none"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
              {project.domain}
            </span>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug mt-0.5 line-clamp-2">
              {project.title}
            </h3>
          </div>
          <span className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <span className={`h-1.5 w-1.5 rounded-full ${statusColor[project.monitorStatus]} animate-pulse`} />
            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">{project.monitorStatus}</span>
          </span>
        </div>

        <MiniChart seed={index} />

        <div className="grid grid-cols-3 gap-2">
          {project.metrics.map((m) => (
            <div key={m.label} className="font-mono">
              <div className="text-sm font-semibold text-ops-600 dark:text-ops-400">{m.value}</div>
              <div className="text-[9px] uppercase tracking-wide text-zinc-500 truncate">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 font-mono text-[10px] text-zinc-500 space-y-0.5 overflow-hidden h-10">
          {project.logEntries.slice(0, 2).map((log, i) => (
            <div key={i} className="truncate">
              <span className="text-ops-600 dark:text-ops-500">[{log.timestamp}]</span> {log.message}
            </div>
          ))}
        </div>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              {project.logo && (
                <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <img src={project.logo} alt="" className="w-full h-full object-contain p-1" />
                </div>
              )}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {project.domain}
                </span>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{project.title}</h3>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ops-600 dark:text-ops-400 hover:text-ops-700 dark:hover:text-ops-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Kunjungi
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
