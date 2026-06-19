import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[], navHeight = 80): string => {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + navHeight + 10;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, navHeight]);

  return activeSection;
};
