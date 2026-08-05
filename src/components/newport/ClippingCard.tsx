import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus, FileText } from 'lucide-react';
import type { Project } from '../../types';
import { LIFT, REVEAL } from './motion';

const statusLabel: Record<Project['status'], string> = {
  selesai: 'Selesai',
  sedang_berjalan: 'Berjalan',
  direncanakan: 'Direncanakan',
};

/** Paper swatch tints, cycled by position so neighbouring clippings differ. */
const TINTS = ['#cfe0c9', '#c9d7ea', '#ecd9b8', '#e3cfe0', '#e8c9cf'];

/**
 * Picks the most informative metric to annotate the clipping with. "Uptime"
 * sits on almost every project, so it says the least; prefer anything else.
 */
function annotation(project: Project): string | null {
  const metric = project.metrics.find((m) => !/uptime/i.test(m.label)) ?? project.metrics[0];
  return metric ? `${metric.label}: ${metric.value}` : null;
}

interface ClippingCardProps {
  project: Project;
  index: number;
  size: 'large' | 'small';
  tilt: number;
  onOpen: (project: Project) => void;
}

export const ClippingCard: React.FC<ClippingCardProps> = ({
  project,
  index,
  size,
  tilt,
  onOpen,
}) => {
  const reduce = useReducedMotion();
  const [logoError, setLogoError] = useState(false);

  const isLarge = size === 'large';
  const note = annotation(project);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...REVEAL, delay: (index % 5) * 0.08 }}
      className="h-full"
    >
      {/* Hover lives on its own layer so its spring never fights the reveal's easing. */}
      <motion.div
        animate={{ rotate: reduce ? 0 : tilt }}
        whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
        transition={LIFT}
        className="h-full"
      >
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Lihat detail ${project.title}`}
          className="relative flex h-full w-full flex-col border border-zine-rule bg-zine-card px-3.5 pb-3.5 pt-4 text-left shadow-[0_3px_0_rgba(31,30,28,0.06)] transition-shadow duration-500 hover:shadow-[0_14px_28px_-16px_rgba(31,30,28,0.55)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_3px_0_rgba(0,0,0,0.25)]"
        >
          <span
            className={`np-tape ${index % 2 === 1 ? 'np-tape--cool' : ''}`}
            aria-hidden="true"
          />
          {index % 3 === 0 && <span className="np-pin" aria-hidden="true" />}

          <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
            {project.domain}
          </span>

          {isLarge && (
            <span
              className="mt-2 flex h-[68px] items-center justify-center overflow-hidden rounded-[3px] sm:h-[76px]"
              style={{ background: TINTS[index % TINTS.length] }}
            >
              {project.logo && !logoError ? (
                <img
                  src={project.logo}
                  alt=""
                  draggable={false}
                  onError={() => setLogoError(true)}
                  className="h-full w-full object-contain p-2.5"
                />
              ) : (
                <FileText className="h-6 w-6 text-zine-ink/45" strokeWidth={1.6} />
              )}
            </span>
          )}

          {/*
            Clamped with a reserved height: titles range from two words to a
            full sentence, and inside a snapping track every slide has to be
            the same height or the row reads as broken.
          */}
          <span
            className={`np-hand mt-2.5 line-clamp-3 text-zine-ink dark:text-zine-ink-dark ${
              isLarge ? 'min-h-[3.6rem] text-[16px] sm:text-[19px]' : 'min-h-[3.6rem] text-[14px] sm:text-[16px]'
            }`}
          >
            {project.title}
          </span>

          {isLarge && note && (
            <span className="np-hand mt-1 block truncate text-[13px] text-zine-pen dark:text-zine-pen-dark">
              {note}
            </span>
          )}

          <span className="mt-auto flex items-center justify-between border-t border-dashed border-zine-rule pt-2.5 dark:border-zine-rule-dark">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
              {statusLabel[project.status]}
            </span>
            <Plus className="h-3.5 w-3.5 text-zine-pen dark:text-zine-pen-dark" />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};
