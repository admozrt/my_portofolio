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

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link') as HTMLLinkElement;
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', data.url);

    // Basic meta tags
    setMetaTag('description', data.description);
    setMetaTag('keywords', data.keywords.join(', '));
    setMetaTag('author', data.author);
    setMetaTag('robots', 'index, follow');

    // Open Graph tags
    setMetaTag('og:title', data.title, true);
    setMetaTag('og:description', data.description, true);
    setMetaTag('og:image', data.image, true);
    setMetaTag('og:url', data.url, true);
    setMetaTag('og:type', data.type, true);
    setMetaTag('og:locale', 'id_ID', true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', data.title);
    setMetaTag('twitter:description', data.description);
    setMetaTag('twitter:image', data.image);

    // Structured data (JSON-LD) — schema type based on page context
    const schemaType = data.schemaType ?? 'Person';

    let structuredData: Record<string, unknown>;

    if (schemaType === 'SoftwareApplication') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Core POS by Dirakhmat",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": data.description,
        "url": data.url,
        "image": data.image,
        "author": {
          "@type": "Person",
          "name": "Adi Rakhmatullah Ma'arif",
          "url": "https://dirakhmat.app"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IDR",
          "description": "Demo gratis tersedia — hubungi untuk penawaran"
        },
        "featureList": [
          "Multi-sektor: Retail, F&B, Jasa, Apotek, Koperasi",
          "RBAC granular",
          "Stok FEFO",
          "Struk digital",
          "Dashboard real-time"
        ]
      };
    } else if (schemaType === 'Service') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Solusi Digital Institusional",
        "description": data.description,
        "url": data.url,
        "image": data.image,
        "provider": {
          "@type": "Person",
          "name": "Adi Rakhmatullah Ma'arif",
          "url": "https://dirakhmat.app",
          "email": "adrakhmat996@gmail.com",
          "telephone": "+62895362260101"
        },
        "areaServed": "Indonesia",
        "serviceType": [
          "Sistem Informasi Pemerintahan",
          "Sistem Informasi Kesehatan",
          "Sistem Manajemen Logistik",
          "Pengembangan Software Custom"
        ]
      };
    } else {
      // Default: Person schema for portfolio page
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Adi Rakhmatullah Ma'arif",
        "jobTitle": "Software Engineer & Developer",
        "url": data.url,
        "image": data.image,
        "email": "adrakhmat996@gmail.com",
        "telephone": "+62895362260101",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Banjarbaru",
          "addressRegion": "Kalimantan Selatan",
          "addressCountry": "ID"
        },
        "sameAs": [
          "https://www.linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b",
          "https://github.com/admozart"
        ],
        "knowsAbout": [
          "Laravel", "React", "PHP", "JavaScript", "TypeScript",
          "Pengembangan Web", "Full Stack Development", "REST API"
        ],
        "description": data.description
      };
    }

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