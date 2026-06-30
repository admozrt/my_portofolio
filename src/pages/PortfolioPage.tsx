import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../components/providers/Theme';
import { SEOHead } from '../components/ui/SEOHead';
import { Navigation } from '../components/layout/Navigation';
import { SplashScreen } from '../components/layout/SplashScreen';
import { HeroSection } from '../components/sections/HeroSection';
import { TechMarquee } from '../components/ui/TechMarquee';
import { AboutSection } from '../components/sections/AboutSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { ProjectsSection } from '../components/sections/ProjectSection';
import { PartnersSection } from '../components/sections/PartnerSection';
import { Footer } from '../components/layout/Footer';
import { seoData } from '../data/seoData';

export const PortfolioPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') return;

    const elements = document.querySelectorAll('h1, h2, h3, h4, p, span');
    for (const element of Array.from(elements)) {
      const text = element.textContent?.toLowerCase() || '';
      if (text.includes(searchTerm.toLowerCase())) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }, [searchTerm]);

  return (
    <ThemeProvider>
      <SplashScreen onComplete={() => setSplashDone(true)} />

      <div
        className="font-sans bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-200"
        style={{ visibility: splashDone ? 'visible' : 'hidden' }}
      >
        <SEOHead data={seoData} />
        <Navigation searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <HeroSection />
        <TechMarquee />
        <ProjectsSection />
        <AboutSection />
        <ExperienceSection />
        <PartnersSection />
        <Footer />
      </div>
    </ThemeProvider>
  );
};
