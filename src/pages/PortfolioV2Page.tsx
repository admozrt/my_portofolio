import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOHead } from '../components/ui/SEOHead';
import { ThemeProvider } from '../components/providers/Theme';
import { useLang } from '../hooks/useLang';
import { useProjects } from '../hooks/useLocalizedData';
import { skills } from '../data/skill';
import { projectUses } from '../data/v2Phases';
import { PenLine } from '../components/v2/PenLine';
import { V2Splash } from '../components/v2/V2Splash';
import { Hero } from '../components/v2/Hero';
import { LayeredProject } from '../components/v2/LayeredProject';
import {
  ContactSketch,
  HowIWork,
  Integrations,
  ReleaseLog,
  SectionHead,
  SolutionLink,
  StatusBoard,
  Toolbox,
  V2Header,
} from '../components/v2/Sections';
import '../components/v2/v2.css';

/**
 * Halaman utama portofolio (/ dan /en) — konsep "Rancang → Bangun → Rawat".
 * Menggantikan portofolio zine; /v2 dan /en/v2 (alamat uji cobanya)
 * dialihkan ke sini.
 *
 * Kalimat inti jadi benang merah: tiap section menjawab satu fase, garis pena
 * di tepi kiri mencatat kemajuan baca, kartu projek terurai jadi lapisan
 * rancang/bangun/rawat, dan hero punya senter yang menyingkap rancangan di
 * bawah produk jadi.
 */

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap';

const PortfolioV2Content: React.FC = () => {
  const { t, lang } = useLang();
  const projects = useProjects();
  const [tool, setTool] = useState<string | null>(null);
  const [splashDone, setSplashDone] = useState(false);
  const { hash } = useLocation();

  /* Halaman lain menautkan ke sini sebagai "/#projek" dan sejenisnya. Gulir
     setelah animasi pembuka selesai — selama pembuka, scroll dikunci. */
  useEffect(() => {
    if (!splashDone || !hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64 });
  }, [splashDone, hash]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const matches = (p: (typeof projects)[number]) => !!tool && projectUses(tool, p.technologies);

  const sections = useMemo(
    () => [
      { id: 'beranda', label: t.v2.phase.rancang + ' · ' + t.v2.phase.bangun + ' · ' + t.v2.phase.rawat },
      { id: 'projek', label: t.nav.projek },
      { id: 'integrasi', label: t.v2.intHeading },
      { id: 'softskill', label: t.nav.softskill },
      { id: 'skill', label: t.nav.skill },
      { id: 'pengalaman', label: t.nav.pengalaman },
      { id: 'mitra', label: t.nav.mitra },
      { id: 'kontak', label: t.nav.kontak },
    ],
    [t]
  );

  return (
    <div className="v2-root">
      <SEOHead
        data={{
          title: t.seo.homeTitle,
          description: t.seo.homeDescription,
          keywords: t.seo.homeKeywords,
          author: "Adi Rakhmatullah Ma'arif",
          // Canonical menunjuk dirinya sendiri. Kalau /en ber-canonical ke /,
          // Google menganggapnya salinan dan membuangnya dari indeks.
          url: lang === 'en' ? 'https://dirakhmat.app/en' : 'https://dirakhmat.app',
          image: 'https://dirakhmat.app/my.png',
          type: 'website',
          locale: lang === 'en' ? 'en_GB' : 'id_ID',
          alternates: [
            { hreflang: 'id', href: 'https://dirakhmat.app' },
            { hreflang: 'en', href: 'https://dirakhmat.app/en' },
            { hreflang: 'x-default', href: 'https://dirakhmat.app' },
          ],
        }}
      />

      {/* Animasi pembuka di setiap akses/refresh, seperti v1. Halaman sudah
          dirender di bawahnya supaya lubang senter memperlihatkan isinya. */}
      <V2Splash onComplete={() => setSplashDone(true)} />

      <V2Header nav={sections.slice(1)} />
      <PenLine sections={sections} />

      <main className="v2-main">
        <Hero projectCount={projects.length} skillCount={skills.length} />

        <section id="projek" className="v2-sec">
          <SectionHead title={t.projects.heading} intro={t.v2.projectsIntro} />
          <div className="v2-projects">
            {featured.map((p, i) => (
              <LayeredProject key={p.id} project={p} index={i} dimmed={!!tool && !matches(p)} matched={matches(p)} />
            ))}
          </div>
          {others.length > 0 && (
            <>
              <h3 className="v2-subhead">{t.v2.otherProjects}</h3>
              <ul className="v2-others">
                {others.map((p) => (
                  <li
                    key={p.id}
                    id={`proj-${p.id}`}
                    className={`${tool && !matches(p) ? 'is-dim' : ''}${matches(p) ? ' is-match' : ''}`}
                  >
                    <span className="v2-live v2-live--sm">
                      <i />
                    </span>
                    <span className="v2-others__main">
                      <b>{p.title}</b>
                      <span>{p.domain}</span>
                    </span>
                    <span className="v2-others__metric">
                      {p.metrics[0]?.value} <small>{p.metrics[0]?.label}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <Integrations />
        <HowIWork />
        <Toolbox projects={projects} selected={tool} onSelect={setTool} />
        <ReleaseLog />
        <StatusBoard />
        <SolutionLink />
        <ContactSketch />
      </main>

      <footer className="v2-footer">
        <span>© {new Date().getFullYear()} Adi Rakhmatullah Ma'arif</span>
        <span>{t.v2.footer}</span>
      </footer>
    </div>
  );
};

/* ThemeProvider dipasang per halaman di proyek ini (lihat InstitutionalSolutionsPage), bukan
   di App — tanpa ini useTheme di header melempar error dan halaman kosong. */
export const PortfolioV2Page: React.FC = () => (
  <ThemeProvider>
    <PortfolioV2Content />
  </ThemeProvider>
);

export default PortfolioV2Page;
