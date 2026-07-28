import React, { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  Plus,
  HeartPulse,
  Anchor,
  ShoppingCart,
  Landmark,
  GraduationCap,
  Clock,
  Heart,
  MapPin,
  Server,
} from 'lucide-react';
import type { Project } from '../../types';

const statusColor: Record<Project['monitorStatus'], string> = {
  LIVE: 'bg-ops-500',
  OPERATIONAL: 'bg-ops-600',
  STANDBY: 'bg-amber-500',
};

/** Domain → icon lookup for the badge; keyword-matched so new domain labels still land somewhere sensible. */
function domainIcon(domain: string) {
  const d = domain.toLowerCase();
  if (d.includes('kesehatan')) return HeartPulse;
  if (d.includes('pelayaran') || d.includes('logistik') || d.includes('kapal')) return Anchor;
  if (d.includes('retail') || d.includes('umkm') || d.includes('pos')) return ShoppingCart;
  if (d.includes('kreatif') || d.includes('personal')) return Heart;
  if (d.includes('pariwisata')) return MapPin;
  if (d.includes('pemerintahan')) return Landmark;
  if (d.includes('pendidikan')) return GraduationCap;
  if (d.includes('sdm') || d.includes('operasional')) return Clock;
  return Server;
}

/** Seeded full-width "signal trace" — purely decorative, not real telemetry (same honesty rule as the rest of Control Room). */
function tracePath(seed: number) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const n = Math.sin(seed + i * 0.9) * 12 + Math.cos(seed * 0.6 + i * 1.7) * 8;
    return 22 + n;
  });
  return points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 540} ${y.toFixed(1)}`)
    .join(' ');
}

export const MonitorCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const Icon = domainIcon(project.domain);

  const toggle = () => setOpen((v) => !v);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(700px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  const remainingMetrics = project.metrics.slice(1);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="monitor-card group relative text-left rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 flex flex-col cursor-pointer transition-colors hover:border-ops-600 dark:hover:border-ops-500 outline-none focus-visible:border-ops-600"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', transition: 'transform 0.12s ease-out, border-color 0.3s ease' }}
    >
      {/* Icon badge + status/category row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-ops-50 dark:bg-ops-500/10 overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
          {project.logo && !logoError ? (
            <img
              src={project.logo}
              alt=""
              onError={() => setLogoError(true)}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <Icon className="h-[18px] w-[18px] text-ops-600 dark:text-ops-400" strokeWidth={1.7} />
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${statusColor[project.monitorStatus]} animate-pulse`} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {project.monitorStatus}
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wide text-ops-600 dark:text-ops-400 text-right line-clamp-1">
            {project.domain}
          </span>
        </div>
      </div>

      {/* Signal trace */}
      <div className="w-full h-11 mb-4 overflow-hidden text-ops-600 dark:text-ops-500 transition-opacity group-hover:opacity-100">
        <svg viewBox="0 0 540 44" preserveAspectRatio="none" className="w-full h-full block overflow-visible">
          <path
            d={tracePath(index + 1)}
            className="monitor-card-trace"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.65 }}
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 min-h-[2.75rem] mb-1.5">
        {project.title}
      </h3>
      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[2.4rem] mb-4">
        {project.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
          {project.metrics[0]?.label}{' '}
          <b className="text-zinc-900 dark:text-zinc-200 font-medium">{project.metrics[0]?.value}</b>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-ops-600 dark:text-ops-400">
          Detail
          <Plus className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
        </span>
      </div>

      {/* Expandable detail panel */}
      <div className="grid transition-all duration-300 ease-signature" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="mt-4 pt-3.5 border-t border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.technologies.map((t, i) => (
                <span
                  key={t}
                  className="monitor-card-chip font-mono text-[10px] px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-white/[0.02]"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {t}
                </span>
              ))}
            </div>

            {remainingMetrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {remainingMetrics.map((m) => (
                  <div key={m.label} className="font-mono">
                    <div className="text-sm font-semibold text-ops-600 dark:text-ops-400">{m.value}</div>
                    <div className="text-[9px] uppercase tracking-wide text-zinc-500 truncate">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="font-mono text-[10px] text-zinc-500 space-y-0.5 mb-3">
              {project.logEntries.slice(0, 3).map((log, i) => (
                <div key={i} className="truncate">
                  <span className="text-ops-600 dark:text-ops-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ops-600 dark:text-ops-400 hover:text-ops-700 dark:hover:text-ops-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Kunjungi
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
