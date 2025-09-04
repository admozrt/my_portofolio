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
  featured?: boolean;
  status: 'selesai' | 'sedang_berjalan' | 'direncanakan';
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
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  image: string;
  type: string;
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