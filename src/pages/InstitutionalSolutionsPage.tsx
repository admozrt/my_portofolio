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
import { useTransformationChapters } from '../hooks/useLocalizedData';
import { useLang } from '../hooks/useLang';

export const InstitutionalSolutionsPage: React.FC = () => {
  const { t, lang } = useLang();
  const transformationChapters = useTransformationChapters();
  return (
    <ThemeProvider>
    <div className="font-sans min-h-screen">
      <SEOHead
        data={{
          title: t.seo.solutionsTitle,
          description: t.seo.solutionsDescription,
          keywords: t.seo.solutionsKeywords,
          author: "Adi Rakhmatullah Ma'arif",
          url:
            lang === 'en'
              ? 'https://dirakhmat.app/en/solusi-digital'
              : 'https://dirakhmat.app/solusi-digital',
          locale: lang === 'en' ? 'en_US' : 'id_ID',
          alternates: [
            { hreflang: 'id', href: 'https://dirakhmat.app/solusi-digital' },
            { hreflang: 'en', href: 'https://dirakhmat.app/en/solusi-digital' },
            { hreflang: 'x-default', href: 'https://dirakhmat.app/solusi-digital' },
          ],
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
