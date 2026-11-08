import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../types';
import { useLang } from '../../hooks/useLang';
import { PHASES, type Phase } from '../../data/v2Phases';

/**
 * Kartu projek "lapisan terurai": tiga lapis tumpuk — rancang (kerangka
 * putus-putus), bangun (antarmuka), rawat (status berjalan).
 *
 * - Gulir: lapisan terurai sendiri saat kartu mendekati tengah layar dan
 *   merapat lagi saat menjauh. Tanpa hover, jadi sama di ponsel dan desktop.
 * - Penggeser fase: menonjolkan satu lapis dan menahan kartu tetap terurai.
 * - Semua isi penting (judul, domain, deskripsi, teknologi, angka) juga ada
 *   sebagai teks biasa di sebelah tumpukan; tumpukan 3D hanya ilustrasi.
 */

interface Props {
  project: Project;
  index: number;
  /** Skill yang sedang dipilih di Kotak perkakas: kartu yang tidak memakainya meredup. */
  dimmed?: boolean;
  matched?: boolean;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export const LayeredProject: React.FC<Props> = ({ project, index, dimmed, matched }) => {
  const { t } = useLang();
  const cardRef = useRef<HTMLElement>(null);
  const [spread, setSpread] = useState(0);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSpread(0.55);
      return;
    }
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - window.innerHeight / 2) / (window.innerHeight * 0.55);
      setSpread(clamp(1 - dist));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    // Hitung hanya saat kartu terlihat; di luar layar tidak ada pekerjaan per gulir.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const s = phase ? 1 : spread;
  const gap = 6 + s * 34;
  const focus = (p: Phase) => !phase || phase === p;
  const hasLink = project.link && project.link !== '#';
  const lastLog = project.logEntries[project.logEntries.length - 1];

  return (
    <article
      ref={cardRef}
      id={`proj-${project.id}`}
      className={`v2-proj${index % 2 ? ' v2-proj--flip' : ''}${dimmed ? ' is-dim' : ''}${matched ? ' is-match' : ''}`}
    >
      <div className="v2-proj__stage" aria-hidden="true">
        <div
          className="v2-proj__stack"
          style={{ transform: `rotateX(${52 - s * 6}deg) rotateZ(${-24 + s * 4}deg)` }}
        >
          <div
            className="v2-layer v2-layer--rancang"
            style={{ transform: 'translateZ(0px)', opacity: focus('rancang') ? 1 : 0.25 }}
          >
            <span className="v2-layer__tag">{t.v2.layer.rancang}</span>
            <div className="v2-wire">
              <i className="v2-wire__bar" />
              <i className="v2-wire__box" />
              <i className="v2-wire__box" />
              <i className="v2-wire__box" />
            </div>
            <span className="v2-layer__note">{project.domain}</span>
          </div>
          <div
            className={`v2-layer v2-layer--bangun bg-gradient-to-br ${project.gradient}`}
            style={{ transform: `translateZ(${gap}px)`, opacity: focus('bangun') ? 1 : 0.25 }}
          >
            <span className="v2-layer__tag v2-layer__tag--light">{project.bangunLabel ?? t.v2.layer.bangun}</span>
            {project.logo && <img className="v2-layer__logo" src={project.logo} alt="" loading="lazy" />}
            <span className="v2-layer__title">{project.title.split(' - ')[0]}</span>
          </div>
          <div
            className="v2-layer v2-layer--rawat"
            style={{ transform: `translateZ(${gap * 2}px)`, opacity: focus('rawat') ? 1 : 0.25 }}
          >
            <span className="v2-layer__tag">{t.v2.layer.rawat}</span>
            <span className="v2-live">
              <i />
              {t.v2.live}
            </span>
            <div className="v2-layer__metrics">
              {project.metrics.slice(0, 2).map((m) => (
                <span key={m.label}>
                  <b>{m.value}</b>
                  {m.label}
                </span>
              ))}
            </div>
            {lastLog && (
              <span className="v2-layer__log">
                {lastLog.timestamp} · {lastLog.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="v2-proj__body">
        <span className="v2-kicker">{project.domain}</span>
        <h3 className="v2-proj__title">{project.title}</h3>
        <p className={`v2-proj__desc${open ? ' is-open' : ''}`}>{project.description}</p>

        <div className="v2-phase-picker" role="radiogroup" aria-label={t.v2.pickPhase}>
          {PHASES.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={phase === p}
              className={`v2-phase-picker__btn v2-phase-picker__btn--${p}${phase === p ? ' is-on' : ''}`}
              onClick={() => setPhase((cur) => (cur === p ? null : p))}
            >
              {p === 'bangun' && project.bangunLabel ? project.bangunLabel : t.v2.phase[p]}
            </button>
          ))}
        </div>

        {open && (
          <div className="v2-proj__detail">
            <dl className="v2-proj__metrics">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="v2-proj__log">
              <span className="v2-mono-label">{t.v2.lastActivity}</span>
              {project.logEntries.map((l) => (
                <div key={l.timestamp + l.message}>
                  <span>{l.timestamp}</span> {l.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <ul className="v2-chips" aria-label={t.projects.technology}>
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <div className="v2-proj__actions">
          <button type="button" className="v2-link-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? t.v2.closeProject : t.v2.openProject}
          </button>
          {hasLink && (
            <a
              className="v2-link-btn"
              href={project.link}
              target={project.link.startsWith('/') ? undefined : '_blank'}
              rel={project.link.startsWith('/') ? undefined : 'noopener noreferrer'}
            >
              {t.projects.visit} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
