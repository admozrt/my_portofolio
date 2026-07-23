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
          title: "Solusi Digital - Adi Rakhmatullah Ma'arif",
          description:
            'Sistem digital yang terukur, aman, dan bisa dipertanggungjawabkan untuk instansi pemerintah, kesehatan, dan logistik.',
          keywords: ['Solusi Produk Digital', 'Sistem Pemerintahan', 'Sistem Kesehatan', 'Software Engineer'],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app/solusi-digital',
          image: 'https://dirakhmat.app/my.png',
          type: 'website',
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
