import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '../components/providers/Theme';
import { SEOHead } from '../components/ui/SEOHead';
import { ZineSplash } from '../components/newport/ZineSplash';
import { ZineHeader } from '../components/newport/ZineHeader';
import { ZineHero } from '../components/newport/ZineHero';
import { ClippingBoard } from '../components/newport/ClippingBoard';
import { SkillTags } from '../components/newport/SkillTags';
import { SoftSkillNotes } from '../components/newport/SoftSkillNotes';
import { NotebookExperience } from '../components/newport/NotebookExperience';
import { SolutionNote } from '../components/newport/SolutionNote';
import { PartnerNotes } from '../components/newport/PartnerNotes';
import { PostcardContact } from '../components/newport/PostcardContact';
import { ZineFooter } from '../components/newport/ZineFooter';
import { projects } from '../data/project';
import { skills } from '../data/skill';
import { useLang } from '../hooks/useLang';
import './NewPortPage.css';

/**
 * Portfolio homepage, "zine" concept: paper and handwriting rather than the
 * monitor-wall reading of the same data. The earlier Control Room version is
 * kept in the codebase but its route is switched off in App.tsx.
 */
export const NewPortPage: React.FC = () => {
  const [splashDone, setSplashDone] = useState(false);
  const { t, lang } = useLang();
  const { hash } = useLocation();

  // Sub-pages link back here as "/#projek" and friends. Wait for the splash to
  // clear first, or the target is still hidden when we try to scroll to it.
  useEffect(() => {
    if (!splashDone || !hash) return;
    const el = document.getElementById(hash.replace('#', ''));
    if (!el) return;
    const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
    return () => clearTimeout(t);
  }, [splashDone, hash]);

  return (
    <ThemeProvider>
      <SEOHead
        data={{
          title: t.seo.homeTitle,
          description: t.seo.homeDescription,
          keywords: t.seo.homeKeywords,
          author: "Adi Rakhmatullah Ma'arif",
          // Canonical menunjuk dirinya sendiri. Kalau /en ber-canonical ke /,
          // Google menganggapnya salinan dan membuangnya dari indeks.
          url: lang === 'en' ? 'https://dirakhmat.app/en' : 'https://dirakhmat.app',
          locale: lang === 'en' ? 'en_GB' : 'id_ID',
          alternates: [
            { hreflang: 'id', href: 'https://dirakhmat.app' },
            { hreflang: 'en', href: 'https://dirakhmat.app/en' },
            { hreflang: 'x-default', href: 'https://dirakhmat.app' },
          ],
          image: 'https://dirakhmat.app/my.png',
          type: 'website',
        }}
      />

      <ZineSplash onComplete={() => setSplashDone(true)} />

      <div
        className="np-paper min-h-[100dvh] overflow-x-hidden bg-zine-paper font-sans text-zine-ink transition-colors duration-200 dark:bg-zine-paper-dark dark:text-zine-ink-dark"
        style={{ visibility: splashDone ? 'visible' : 'hidden' }}
      >
        <ZineHeader />
        {/* Offsets the fixed header so the hero does not start underneath it. */}
        <main className="pt-14 sm:pt-16">
          <ZineHero projectCount={projects.length} skillCount={skills.length} />
          <ClippingBoard />
          <SkillTags />
          <SoftSkillNotes />
          <NotebookExperience />
          <SolutionNote />
          <PartnerNotes />
          <PostcardContact />
        </main>
        <ZineFooter />
      </div>
    </ThemeProvider>
  );
};
