import React, { useEffect } from 'react';
import type { SEOHeadProps } from '../../types';

export const SEOHead: React.FC<SEOHeadProps> = ({ data }) => {
  useEffect(() => {
    document.title = data.title;
    
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      let meta = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', data.description);
    setMetaTag('keywords', data.keywords.join(', '));
    setMetaTag('author', data.author);
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1');

    // Open Graph tags
    setMetaTag('og:title', data.title, true);
    setMetaTag('og:description', data.description, true);
    setMetaTag('og:image', data.image, true);
    setMetaTag('og:url', data.url, true);
    setMetaTag('og:type', data.type, true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', data.title);
    setMetaTag('twitter:description', data.description);
    setMetaTag('twitter:image', data.image);

    // Structured data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Adi Rakhmatullah Ma'arif",
      "jobTitle": "Pengembang Full Stack",
      "url": data.url,
      "image": data.image,
      "email": "admozart996@gmail.com",
      "telephone": "+62895362260101",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Depok",
        "addressRegion": "Jawa Barat",
        "addressCountry": "Indonesia"
      },
      "sameAs": [
        "https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b",
        "https://github.com/admozrt"
      ],
      "knowsAbout": ["Laravel", "React", "PHP", "JavaScript", "Pengembangan Web", "Pengembangan Full Stack"],
      "alumniOf": "Teknik Informatika",
      "description": data.description
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script') as HTMLScriptElement;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

  }, [data]);

  return null;
};