import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../../types';
import { SHEET } from './motion';

const statusLabel: Record<Project['status'], string> = {
  selesai: 'Selesai',
  sedang_berjalan: 'Berjalan',
  direncanakan: 'Direncanakan',
};

interface ProjectSheetProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Project detail as a sheet of paper laid over the board. The main portfolio
 * expands this inline, but here the cards live inside a horizontal slider, so
 * growing one card would break the track; an overlay keeps the row intact and
 * gives the full record room to breathe on a phone.
 */
export const ProjectSheet: React.FC<ProjectSheetProps> = ({ project, onClose }) => {
  const reduce = useReducedMotion();
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const hasLink = project ? project.link !== '#' : false;
  const isInternal = project ? project.link.startsWith('/') : false;

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-zine-ink/45 backdrop-blur-[2px]"
          />

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={SHEET}
            className="relative z-10 flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden border border-zine-rule bg-zine-card shadow-[0_24px_60px_-30px_rgba(31,30,28,0.7)] dark:border-zine-rule-dark dark:bg-zine-card-dark"
          >
            <span className="np-tape" aria-hidden="true" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail"
              className="absolute right-3 top-3 z-10 rounded-full border border-zine-rule p-1.5 text-zine-ink-soft transition-colors hover:text-zine-pen dark:border-zine-rule-dark dark:text-zine-ink-soft-dark dark:hover:text-zine-pen-dark"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto px-5 pb-6 pt-7 sm:px-8 sm:pb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                {project.domain}
              </p>
              <h3 className="np-hand mt-1.5 pr-8 text-[24px] text-zine-ink dark:text-zine-ink-dark sm:text-[30px]">
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-zine-pen dark:text-zine-pen-dark">
                {statusLabel[project.status]}
              </p>

              <p className="mt-5 text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark sm:text-[14px]">
                {project.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[1.1fr_1fr]">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                    Angka
                  </h4>
                  <dl className="mt-3 space-y-3">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dd className="np-hand text-[21px] text-zine-pen dark:text-zine-pen-dark">
                          {metric.value}
                        </dd>
                        <dt className="mt-0.5 text-[12px] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                          {metric.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                    Aktivitas
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {project.logEntries.map((log) => (
                      <li
                        key={`${log.timestamp}-${log.message}`}
                        className="text-[12.5px] leading-relaxed text-zine-ink dark:text-zine-ink-dark"
                      >
                        <span className="font-mono text-[11px] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                          {log.timestamp}
                        </span>{' '}
                        {log.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 border-t border-dashed border-zine-rule pt-5 dark:border-zine-rule-dark">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                  Teknologi
                </h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="border border-zine-rule px-2 py-1 font-mono text-[10.5px] text-zine-ink-soft dark:border-zine-rule-dark dark:text-zine-ink-soft-dark"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {(hasLink || project.github) && (
                <div className="mt-6 flex flex-wrap gap-5">
                  {hasLink &&
                    (isInternal ? (
                      <Link
                        to={project.link}
                        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zine-pen hover:underline dark:text-zine-pen-dark"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Kunjungi
                      </Link>
                    ) : (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zine-pen hover:underline dark:text-zine-pen-dark"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Kunjungi
                      </a>
                    ))}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zine-ink-soft hover:underline dark:text-zine-ink-soft-dark"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
