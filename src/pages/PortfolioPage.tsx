import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '../components/providers/Theme';
import { SEOHead } from '../components/ui/SEOHead';
import { Navigation } from '../components/layout/Navigation';
import { SplashScreen } from '../components/layout/SplashScreen';
import { ControlRoomHero } from '../components/control-room/ControlRoomHero';
import { MonitorWall } from '../components/control-room/MonitorWall';
import { TechControlPanel } from '../components/control-room/TechControlPanel';
import { SystemLogFeed } from '../components/control-room/SystemLogFeed';
import { TransmissionsPanel } from '../components/control-room/TransmissionsPanel';
import { EstablishConnection } from '../components/control-room/EstablishConnection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { SoundToggle } from '../components/control-room/SoundToggle';
import { ControlRoomFooter } from '../components/control-room/ControlRoomFooter';
import { seoData } from '../data/seoData';

export const PortfolioPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [splashDone, setSplashDone] = useState(false);
  const { hash } = useLocation();

  // Links coming from other pages (e.g. the wedding-showcase Footer) use
  // /#section-id — react-router doesn't auto-scroll to hash anchors, so do
  // it manually once the splash is done and the sections have mounted.
  useEffect(() => {
    if (!splashDone || !hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
      return () => clearTimeout(t);
    }
  }, [splashDone, hash]);

  return (
    <ThemeProvider>
      <SplashScreen onComplete={() => setSplashDone(true)} />

      <div
        className="font-sans bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors duration-200"
        style={{ visibility: splashDone ? 'visible' : 'hidden' }}
      >
        <SEOHead data={seoData} />
        <Navigation searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <ControlRoomHero />
        <MonitorWall />
        <TechControlPanel />
        <SystemLogFeed />
        <TransmissionsPanel />
        <EstablishConnection />
        <ExperienceSection />
        <SoundToggle />
        <ControlRoomFooter />
      </div>
    </ThemeProvider>
  );
};
