import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './components/providers/Theme';
import { SEOHead} from './components/ui/SEOHead';
import { Navigation } from './components/layout/Navigation';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ProjectsSection } from './components/sections/ProjectSection';
import { PartnersSection } from './components/sections/PartnerSection';
import { Footer } from './components/layout/Footer';

import { seoData } from './data/seoData';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    document.head.appendChild(link);

    const root = document.documentElement;
    root.classList.add('scroll-smooth');

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') return;

    const elements = document.querySelectorAll('h1, h2, h3, h4, p, span');
    elements.forEach(element => {
      const text = element.textContent?.toLowerCase() || '';
      if (text.includes(searchTerm.toLowerCase())) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    });
  }, [searchTerm]);

  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <SEOHead data={seoData} />
        <Navigation searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <PartnersSection />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;