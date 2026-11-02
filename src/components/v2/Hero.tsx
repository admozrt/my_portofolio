import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { PHASES, type Phase } from '../../data/v2Phases';
import { BlueprintReveal, type RevealMode } from './BlueprintReveal';
import { yearsOfExperience } from '../../utils/experience';

/**
 * Hero: kalimat inti terbaca tanpa interaksi apa pun. Tiga kata kerjanya bisa
 * diketuk dan mengganti isi panel di samping:
 *   Rancang → rancangan penuh, Bangun → senter blueprint, Rawat → produk +
 *   status berjalan.
 *
 * Rancangan dan produk dibangun dari daftar blok yang sama, jadi garis
 * rancangan selalu tepat di bawah elemen produknya.
 */

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  /** label ukuran di rancangan */
  spec: string;
  kind: 'bar' | 'side' | 'stat' | 'chart' | 'rows';
}

/* Koordinat dalam persen panel. */
const BLOCKS: Block[] = [
  { x: 3, y: 4, w: 94, h: 10, spec: 'header · 56px', kind: 'bar' },
  { x: 3, y: 18, w: 20, h: 78, spec: 'nav · 240px', kind: 'side' },
  { x: 26, y: 18, w: 22, h: 20, spec: 'kartu angka', kind: 'stat' },
  { x: 50.5, y: 18, w: 22, h: 20, spec: 'kartu angka', kind: 'stat' },
  { x: 75, y: 18, w: 22, h: 20, spec: 'kartu angka', kind: 'stat' },
  { x: 26, y: 42, w: 71, h: 28, spec: 'grafik 7 hari', kind: 'chart' },
  { x: 26, y: 74, w: 71, h: 22, spec: 'tabel · 10 baris', kind: 'rows' },
];

const STAT_VALUES = ['1.204', '98%', '36'];
const BARS = [42, 58, 50, 71, 64, 82, 76];

const pos = (b: Block): React.CSSProperties => ({
  left: `${b.x}%`,
  top: `${b.y}%`,
  width: `${b.w}%`,
  height: `${b.h}%`,
});

const Blueprint: React.FC = () => (
  <div className="v2-bp">
    {BLOCKS.map((b, i) => (
      <div key={i} className="v2-bp__block" style={pos(b)}>
        <span>{b.spec}</span>
      </div>
    ))}
    <span className="v2-bp__stamp">REV. 06 · 1440 × 900</span>
  </div>
);

const Product: React.FC<{ live: boolean; liveLabel: string }> = ({ live, liveLabel }) => {
  let stat = 0;
  return (
    <div className="v2-ui">
      {BLOCKS.map((b, i) => (
        <div key={i} className={`v2-ui__block v2-ui__block--${b.kind}`} style={pos(b)}>
          {b.kind === 'bar' && (
            <>
              <i className="v2-ui__logo" />
              <i className="v2-ui__pill" />
            </>
          )}
          {b.kind === 'side' && [0, 1, 2, 3, 4].map((n) => <i key={n} className={n === 1 ? 'is-on' : ''} />)}
          {b.kind === 'stat' && <b>{STAT_VALUES[stat++]}</b>}
          {b.kind === 'chart' &&
            BARS.map((h, n) => <i key={n} style={{ height: `${h}%` }} />)}
          {b.kind === 'rows' && [0, 1, 2].map((n) => <i key={n} />)}
        </div>
      ))}
      {live && (
        <div className="v2-ui__live">
          <span className="v2-live">
            <i />
            {liveLabel} · uptime 99.9%
          </span>
        </div>
      )}
    </div>
  );
};

interface Props {
  projectCount: number;
  skillCount: number;
}

export const Hero: React.FC<Props> = ({ projectCount, skillCount }) => {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>('bangun');
  const [coarse, setCoarse] = useState(false);

  useEffect(() => setCoarse(window.matchMedia('(pointer: coarse)').matches), []);

  const mode: RevealMode = phase === 'rancang' ? 'blueprint' : phase === 'bangun' ? 'reveal' : 'product';

  return (
    <section id="beranda" className="v2-hero">
      <div className="v2-hero__copy">
        <span className="v2-kicker">{t.v2.role}</span>
        <h1 className="v2-hero__title">
          {t.v2.titleA} <span className="v2-hero__accent">{t.v2.titleB}</span>
        </h1>
        <p className="v2-hero__lead">{t.v2.lead}</p>

        <div className="v2-hero__actions">
          <a className="v2-btn v2-btn--solid" href="#kontak">
            {t.v2.contactCta} <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a className="v2-btn" href="#projek">
            {t.v2.seeProjects}
          </a>
        </div>

        <dl className="v2-hero__stats">
          {[
            [`${yearsOfExperience()}+`, t.hero.statYears],
            [`${projectCount}+`, t.hero.statProjects],
            [`${skillCount}+`, t.hero.statTech],
          ].map(([v, l]) => (
            <div key={l}>
              <dd>{v}</dd>
              <dt>{l}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="v2-hero__panel">
        <div className="v2-phase-tabs" role="tablist" aria-label={t.v2.pickPhase}>
          {PHASES.map((p, i) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={phase === p}
              className={`v2-phase-tabs__btn v2-phase-tabs__btn--${p}${phase === p ? ' is-on' : ''}`}
              onClick={() => setPhase(p)}
            >
              <span className="v2-phase-tabs__no">0{i + 1}</span>
              {t.v2.phase[p]}
            </button>
          ))}
        </div>
        <BlueprintReveal
          mode={mode}
          blueprint={<Blueprint />}
          product={<Product live={phase === 'rawat'} liveLabel={t.v2.live} />}
          ariaLabel={t.v2.phaseHint[phase]}
        />
        <p className="v2-hero__hint" aria-live="polite">
          {t.v2.phaseHint[phase]}
          {phase === 'bangun' && <span> {coarse ? t.v2.revealHintTouch : t.v2.revealHintMouse}.</span>}
        </p>
      </div>
    </section>
  );
};
