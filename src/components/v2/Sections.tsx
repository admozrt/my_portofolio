import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Moon, Sun, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useLang } from '../../hooks/useLang';
import { useTheme } from '../../hooks/useTheme';
import { useExperiences, usePartners, useSoftSkills } from '../../hooks/useLocalizedData';
import { softSkills as softSkillsId } from '../../data/softSkill';
import { skills } from '../../data/skill';
import { contactInfo } from '../../data/contact';
import type { Project, Skill } from '../../types';
import { PHASES, SKILL_CATEGORY_PHASE, SOFT_SKILL_PHASE, projectUses, type Phase } from '../../data/v2Phases';
import { LangToggle } from '../ui/LangToggle';
import { Monogram } from '../ui/Monogram';
import { mailLink } from '../../utils/mail';
import { runTransition } from './viewTransition';

/* ─── Kepala section ─────────────────────────────────────────────── */

export const SectionHead: React.FC<{ phase?: Phase; title: string; intro?: string }> = ({ phase, title, intro }) => {
  const { t } = useLang();
  return (
    <header className="v2-head">
      {phase && (
        <span className={`v2-badge v2-badge--${phase}`}>
          {String(PHASES.indexOf(phase) + 1).padStart(2, '0')} · {t.v2.phase[phase]}
        </span>
      )}
      <h2 className="v2-head__title">{title}</h2>
      {intro && <p className="v2-head__intro">{intro}</p>}
    </header>
  );
};

/* ─── Header ─────────────────────────────────────────────────────── */

export const V2Header: React.FC<{ nav: { id: string; label: string }[] }> = ({ nav }) => {
  const { t } = useLang();
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="v2-header">
      <a href="#beranda" className="v2-header__logo" aria-label="Adi Rakhmatullah Ma'arif">
        <Monogram size={30} />
      </a>
      <nav className="v2-header__nav" aria-label="Menu">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`}>
            {n.label}
          </a>
        ))}
      </nav>
      <div className="v2-header__tools">
        <LangToggle variant="plain" onPick={(_, apply) => runTransition('lang', apply)} />
        <button
          type="button"
          className="v2-icon-btn"
          onClick={(e) =>
            runTransition(
              'theme',
              () => {
                // Kelas dipasang langsung supaya potret "sesudah" sudah gelap/terang
                // tanpa menunggu efek ThemeProvider.
                document.documentElement.classList.toggle('dark', !isDark);
                toggleTheme();
              },
              { x: e.clientX, y: e.clientY }
            )
          }
          aria-label={isDark ? t.common.toLight : t.common.toDark}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

/* ─── Cara kerja (soft skill per fase) ───────────────────────────── */

export const HowIWork: React.FC = () => {
  const { t } = useLang();
  const localized = useSoftSkills();
  /* Fase ditentukan dari nama versi Indonesia (kunci pemetaan); urutan data
     lokal sama dengan data asli. */
  const byPhase = useMemo(() => {
    const out: Record<Phase, { name: string; description: string }[]> = { rancang: [], bangun: [], rawat: [] };
    softSkillsId.forEach((s, i) => {
      const phase = SOFT_SKILL_PHASE[s.name] ?? 'bangun';
      out[phase].push(localized[i] ?? s);
    });
    return out;
  }, [localized]);

  return (
    <section id="softskill" className="v2-sec">
      <SectionHead phase="rancang" title={t.softSkills.heading} intro={t.v2.howIntro} />
      <div className="v2-how">
        {PHASES.map((p, i) => (
          <div key={p} className={`v2-how__col v2-how__col--${p}`}>
            <div className="v2-how__head">
              <span className="v2-how__no">0{i + 1}</span>
              <span className="v2-how__phase">{t.v2.phase[p]}</span>
            </div>
            <p className="v2-how__hint">{t.v2.phaseHint[p]}</p>
            <ul>
              {byPhase[p].map((s) => (
                <li key={s.name}>
                  <b>{s.name}</b>
                  <span>{s.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Kotak perkakas (skill per fase) ────────────────────────────── */

const SkillIcon: React.FC<{ icon: Skill['icon'] }> = ({ icon }) => {
  if (!icon) return null;
  if (typeof icon === 'object' && 'iconName' in icon) return <FontAwesomeIcon icon={icon} />;
  return <>{icon}</>;
};

const CATEGORIES: Skill['category'][] = ['Backend', 'Frontend', 'Database', 'Tools'];

interface ToolboxProps {
  projects: Project[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ projects, selected, onSelect }) => {
  const { t } = useLang();
  /* Tab per kategori seperti portofolio utama; warnanya tetap mengikuti fase
     kategori itu (Database = rancang, Backend/Frontend = bangun, Tools = rawat). */
  const [tab, setTab] = useState<Skill['category']>('Backend');
  const list = skills.filter((s) => s.category === tab);
  const usedBy = (name: string) => projects.filter((p) => projectUses(name, p.technologies));
  const picked = selected ? usedBy(selected) : [];

  return (
    <section id="skill" className="v2-sec">
      <SectionHead phase="bangun" title={t.v2.toolboxHeading} intro={t.v2.toolboxIntro} />
      <div className="v2-tabs" role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={tab === c}
            className={`v2-tabs__btn v2-tabs__btn--${SKILL_CATEGORY_PHASE[c]}${tab === c ? ' is-on' : ''}`}
            onClick={() => setTab(c)}
          >
            {c}
            <span>{skills.filter((s) => s.category === c).length}</span>
          </button>
        ))}
      </div>

      <div className="v2-tools" role="tabpanel">
        {list.map((s, i) => {
          const on = selected === s.name;
          return (
            <button
              key={s.name}
              type="button"
              className={`v2-tool${on ? ' is-on' : ''}`}
              aria-pressed={on}
              onClick={() => onSelect(on ? null : s.name)}
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className="v2-tool__name">
                <span className={`v2-tool__icon ${s.color ?? ''}`}>
                  <SkillIcon icon={s.icon} />
                </span>
                {s.name}
              </span>
              <span className="v2-tool__bar" role="img" aria-label={t.skills.levelAria(s.name, s.level)}>
                <i style={{ transform: `scaleX(${s.level / 100})` }} />
              </span>
              <span className="v2-tool__meta">
                {s.level}% · {t.v2.usedIn(usedBy(s.name).length)}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="v2-used" aria-live="polite">
          <div className="v2-used__head">
            <b>{selected}</b> — {t.v2.usedIn(picked.length)}
            <button type="button" className="v2-icon-btn" onClick={() => onSelect(null)} aria-label={t.v2.clearTool}>
              <X size={14} />
            </button>
          </div>
          {picked.length > 0 && (
            <ul>
              {picked.map((p) => (
                <li key={p.id}>
                  <a href={`#proj-${p.id}`}>{p.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

/* ─── Log rilis (pengalaman) ─────────────────────────────────────── */

export const ReleaseLog: React.FC = () => {
  const { t } = useLang();
  const experiences = useExperiences();
  const [open, setOpen] = useState<number | null>(experiences[0]?.id ?? null);
  return (
    <section id="pengalaman" className="v2-sec">
      <SectionHead phase="rawat" title={t.v2.logHeading} intro={t.v2.logIntro} />
      <ol className="v2-log">
        {experiences.map((e) => {
          const year = e.period.match(/\d{4}/)?.[0] ?? '';
          const isOpen = open === e.id;
          return (
            <li key={e.id} className={`v2-log__item${isOpen ? ' is-open' : ''}`}>
              <button type="button" className="v2-log__row" onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen}>
                <span className="v2-log__ver">v{year}</span>
                <span className="v2-log__main">
                  <b>{e.title}</b>
                  <span>{e.company}</span>
                </span>
                <span className="v2-log__period">{e.period}</span>
              </button>
              {isOpen && (
                <div className="v2-log__body">
                  <p>{e.description}</p>
                  <span className="v2-mono-label">{t.v2.notes}</span>
                  <ul>
                    {e.achievements.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <ul className="v2-chips">
                    {e.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

/* ─── Integrasi: sistem ⇄ bank / instansi ────────────────────────── */

export const Integrations: React.FC = () => {
  const { t } = useLang();
  const ref = React.useRef<HTMLUListElement>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id="integrasi" className="v2-sec">
      <SectionHead phase="bangun" title={t.v2.intHeading} intro={t.v2.intIntro} />
      <ul ref={ref} className={`v2-int${inView ? ' is-in' : ''}`}>
        {t.v2.intItems.map((it) => (
          <li key={it.system} className="v2-int__row">
            <div className="v2-int__sys">
              <b>{it.system}</b>
              <span>{it.owner}</span>
            </div>
            <div className="v2-int__link" aria-hidden="true">
              <i />
              <small>{t.v2.intLinked}</small>
            </div>
            <ul className="v2-int__partners" aria-label={t.v2.intLinked}>
              {it.partners.map((p) => (
                <li key={p}>
                  <span className="v2-live v2-live--sm">
                    <i />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};

/* ─── Papan status (mitra) ───────────────────────────────────────── */

export const StatusBoard: React.FC = () => {
  const { t } = useLang();
  const partners = usePartners();
  return (
    <section id="mitra" className="v2-sec">
      <SectionHead phase="rawat" title={t.v2.statusHeading} intro={t.v2.statusIntro} />
      <ul className="v2-status">
        {partners.map((p) => {
          const link = p.website && p.website !== '#';
          const inner = (
            <>
              <span className="v2-status__dot" aria-label={t.v2.running} />
              <span className="v2-status__main">
                <b>{p.name}</b>
                <span>{p.relationship}</span>
              </span>
              {link && <ArrowUpRight size={14} aria-hidden="true" />}
            </>
          );
          return (
            <li key={p.id}>
              {link ? (
                <a className="v2-status__row" href={p.website} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div className="v2-status__row">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

/* ─── Solusi digital ─────────────────────────────────────────────── */

export const SolutionLink: React.FC = () => {
  const { t, localePath } = useLang();
  return (
    <section className="v2-sec v2-sec--tight">
      <Link to={localePath('/solusi-digital')} className="v2-solution">
        <span>
          <b>{t.solution.title}</b>
          <span>{t.solution.body}</span>
        </span>
        <span className="v2-btn">
          {t.solution.cta} <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </Link>
    </section>
  );
};

/* ─── Kontak: mulai fase rancang ─────────────────────────────────── */

const EMAIL = 'adrakhmat996@gmail.com';

/* Garis-garis rancangan yang tergambar seiring panjang pesan. */
const SKETCH = [
  'M10 14 H190',
  'M10 30 H70 V110 H10 Z',
  'M82 30 H190 V62 H82 Z',
  'M82 74 H134 V110 H82 Z',
  'M146 74 H190 V110 H146 Z',
  'M92 44 H170',
  'M92 52 H150',
];

export const ContactSketch: React.FC = () => {
  const { t } = useLang();
  const [msg, setMsg] = useState('');
  const progress = Math.min(1, msg.trim().length / 140);
  const link = mailLink(EMAIL, t.v2.mailSubject, msg.trim());
  const others = contactInfo.filter((c) => c.label !== 'Email');

  return (
    <section id="kontak" className="v2-sec">
      <SectionHead phase="rancang" title={t.v2.contactHeading} intro={t.v2.contactIntro} />
      <div className="v2-contact">
        <div className="v2-contact__form">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={t.v2.placeholder}
            rows={6}
            maxLength={2000}
            aria-label={t.v2.contactHeading}
          />
          <a className="v2-btn v2-btn--solid" href={link.href} target={link.target} rel={link.rel}>
            {t.v2.send} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <div className="v2-contact__others">
            <span className="v2-mono-label">{t.v2.orReach}</span>
            {others.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer">
                {c.label}
              </a>
            ))}
            <span className="v2-contact__email">{EMAIL}</span>
          </div>
        </div>
        <div className="v2-contact__side">
          {/* Foto yang sama dengan portofolio utama, dibingkai seperti lembar
              rancangan: garis ukur dan cap revisi. */}
          <figure className="v2-portrait">
            <span className="v2-portrait__label">{t.v2.portraitLabel}</span>
            <span className="v2-portrait__dim v2-portrait__dim--w" aria-hidden="true">
              <span>Adi Rakhmatullah Ma'arif</span>
            </span>
            <div className="v2-portrait__frame">
              <img src="/my.png" alt="Adi Rakhmatullah Ma'arif" draggable={false} loading="lazy" />
              <span className="v2-portrait__corner v2-portrait__corner--tl" aria-hidden="true" />
              <span className="v2-portrait__corner v2-portrait__corner--br" aria-hidden="true" />
            </div>
            <figcaption>
              <b>Adi Rakhmatullah Ma'arif</b>
              <span>Software Engineer · Banjarbaru</span>
            </figcaption>
          </figure>
          <figure className="v2-contact__sketchbox">
          <svg className="v2-contact__sketch" viewBox="0 0 200 124" aria-hidden="true">
            {/* Jejak tipis supaya kotak tidak tampak kosong sebelum ada tulisan. */}
            {SKETCH.map((d, i) => (
              <path key={`g${i}`} d={d} className="v2-contact__ghost" />
            ))}
            {SKETCH.map((d, i) => {
              const share = 1 / SKETCH.length;
              const local = Math.min(1, Math.max(0, (progress - i * share) / share));
              return <path key={i} d={d} pathLength={1} style={{ strokeDashoffset: 1 - local }} />;
            })}
          </svg>
          <figcaption>{t.v2.sketchCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
