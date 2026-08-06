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
import { PostcardContact } from '../components/newport/PostcardContact';
import { ZineFooter } from '../components/newport/ZineFooter';
import { projects } from '../data/project';
import { skills } from '../data/skill';
import './NewPortPage.css';

/**
 * Portfolio homepage, "zine" concept: paper and handwriting rather than the
 * monitor-wall reading of the same data. The earlier Control Room version is
 * kept in the codebase but its route is switched off in App.tsx.
 */
export const NewPortPage: React.FC = () => {
  const [splashDone, setSplashDone] = useState(false);
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
          title: "Adi Rakhmatullah Ma'arif - Software Engineer",
          description:
            "Kumpulan projek dan pengalaman Adi Rakhmatullah Ma'arif, software engineer yang membangun sistem untuk kesehatan, pemerintahan, dan usaha ritel.",
          keywords: ['Software Engineer', 'Portofolio', 'Laravel', 'React', 'Indonesia'],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app',
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
          <PostcardContact />
        </main>
        <ZineFooter />
      </div>
    </ThemeProvider>
  );
};
