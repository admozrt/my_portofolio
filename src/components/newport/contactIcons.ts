import type React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

/**
 * The icons in `src/data/contact.ts` ship their own colors (blue, green, gray),
 * which would break this page's single-accent lock. Re-map by label so the
 * footer and the contact card both render them in the zine palette instead.
 */
export const CONTACT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Email: Mail,
  WhatsApp: Phone,
  LinkedIn: Linkedin,
  GitHub: Github,
};

export const contactIconFor = (label: string) => CONTACT_ICONS[label] ?? Mail;
