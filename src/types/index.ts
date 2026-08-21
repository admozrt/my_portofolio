import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Contact-related types
export interface ContactInfo {
  icon: React.ReactNode;
  text: string;
  href: string;
  label: string;
}

export interface Skill {
  icon?: IconDefinition | React.ReactNode;
  name: string;
  color?: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
}

// Experience-related types
export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

// Project-related types
export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  link: string;
  github?: string;
  gradient: string;
  icon?: string;
  logo?: string;
  featured?: boolean;
  status: 'selesai' | 'sedang_berjalan' | 'direncanakan';
  domain: string;
  monitorStatus: 'LIVE' | 'OPERATIONAL' | 'STANDBY';
  metrics: { label: string; value: string }[];
  logEntries: { timestamp: string; message: string }[];
}

// Partner-related types
export interface Partner {
  id: number;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  category: 'klien' | 'kolaborator' | 'teknologi' | 'edukasi';
  relationship: string;
}

// SEO-related types
export type SEOSchemaType = 'Person' | 'SoftwareApplication' | 'Service' | 'Event';

/** Dipakai halaman undangan: schema Event butuh waktu dan tempat, dan itu
    tidak bisa diturunkan dari judul atau deskripsi. */
export interface SEOEventData {
  /** ISO 8601 lengkap dengan offset zona waktu. */
  startDate: string;
  endDate: string;
  locationName: string;
  streetAddress: string;
  locality: string;
  region: string;
  /** Nama yang ditampilkan sebagai penyelenggara acara. */
  organizers: string[];
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  image: string;
  type: string;
  /** JSON-LD schema.org @type — defaults to 'Person' if omitted */
  schemaType?: SEOSchemaType;
  /** Wajib saat schemaType 'Event'; diabaikan untuk tipe lain. */
  event?: SEOEventData;
}

// Component prop types
export interface NavigationProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export interface SEOHeadProps {
  data: SEOData;
}

export interface ProjectCardProps {
  project: Project;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}