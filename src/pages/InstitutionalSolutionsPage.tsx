import React from 'react';
import { ThemeProvider } from '../components/providers/Theme';
import { SEOHead } from '../components/ui/SEOHead';
import { InstitutionalHeader } from '../components/institutional/InstitutionalHeader';
import { InstitutionalFooter } from '../components/institutional/InstitutionalFooter';
import { SplitHero } from '../components/institutional/SplitHero';
import { TransformationChapter } from '../components/institutional/TransformationChapter';
import { NarrativeBridge } from '../components/institutional/NarrativeBridge';
import { ComplianceSection } from '../components/institutional/ComplianceSection';
import { ReferenceAttachment } from '../components/institutional/ReferenceAttachment';
import { ProposalContact } from '../components/institutional/ProposalContact';
import { transformationChapters } from '../data/transformationChapters';

export const InstitutionalSolutionsPage: React.FC = () => {
  return (
    <ThemeProvider>
    <div className="font-sans min-h-screen">
      <SEOHead
        data={{
          title: "Solusi Digital Institusional — Adi Rakhmatullah Ma'arif",
          description:
            'Sistem digital yang terukur, aman, dan dapat dipertanggungjawabkan untuk instansi pemerintah, layanan kesehatan, dan logistik. Dibangun dengan Laravel, React, dan teknologi modern.',
          keywords: [
            'Solusi Digital',
            'Sistem Informasi Pemerintahan',
            'Sistem Informasi Kesehatan',
            'Sistem Manajemen Logistik',
            'Software Custom',
            'Pengembangan Sistem',
            'Laravel',
            'React',
            'Software Engineer Indonesia',
            'Digital Transformation',
          ],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app/solusi-digital',
          image: 'https://dirakhmat.app/my.png',
          type: 'website',
          schemaType: 'Service',
        }}
      />

      <InstitutionalHeader />

      <SplitHero />

      {transformationChapters.map((chapter, i) => (
        <TransformationChapter key={chapter.id} chapter={chapter} index={i} />
      ))}

      <NarrativeBridge />
      <ComplianceSection />
      <ReferenceAttachment />
      <ProposalContact />
      <InstitutionalFooter />
    </div>
    </ThemeProvider>
  );
};
