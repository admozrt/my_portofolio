import React from 'react';
import { Link } from 'react-router-dom';
import { contactInfo } from '../../data/contact';
import { Monogram } from '../ui/Monogram';
import { contactIconFor } from './contactIcons';

/**
 * Anchors are written as routed links back to the homepage rather than plain
 * scrollIntoView, so this footer also works on sub-pages that do not have
 * those sections. On the homepage the hash effect in NewPortPage picks it up.
 */
const quickLinks = [
  { label: 'Projek', to: '/#projek' },
  { label: 'Skill', to: '/#skill' },
  { label: 'Cara Kerja', to: '/#softskill' },
  { label: 'Pengalaman', to: '/#pengalaman' },
  { label: 'Kontak', to: '/#kontak' },
  { label: 'Solusi Digital', to: '/solusi-digital' },
];

const techs = [
  'PHP',
  'JavaScript',
  'Golang',
  'Laravel',
  'React',
  'React Native',
  'TypeScript',
  'MySQL',
  'Docker',
];

/** Same three-column shape as the main portfolio footer, in the paper palette. */
export const ZineFooter: React.FC = () => (
  <footer className="border-t border-zine-rule py-12 dark:border-zine-rule-dark">
    <div className="mx-auto max-w-5xl px-5">
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <Monogram size={30} strokeClassName="stroke-zine-paper dark:stroke-zine-paper-dark" />
            <span className="text-[14px] font-medium text-zine-ink dark:text-zine-ink-dark">
              Adi Rakhmatullah Ma'arif
            </span>
          </div>
          <p className="mb-5 max-w-xs text-[13px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
            Software engineer yang membangun sistem untuk kesehatan, pemerintahan, dan usaha
            ritel.
          </p>
          <div className="flex gap-2">
            {contactInfo.map((contact) => {
              const Icon = contactIconFor(contact.label);
              return (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={contact.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={contact.label}
                  className="border border-zine-rule p-2 text-zine-ink-soft transition-colors hover:border-zine-pen hover:text-zine-pen dark:border-zine-rule-dark dark:text-zine-ink-soft-dark dark:hover:border-zine-pen-dark dark:hover:text-zine-pen-dark"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
            Navigasi
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-[13px] text-zine-ink-soft transition-colors hover:text-zine-pen dark:text-zine-ink-soft-dark dark:hover:text-zine-pen-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
            Teknologi
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <span
                key={tech}
                className="border border-zine-rule px-2.5 py-1 font-mono text-[10.5px] text-zine-ink-soft dark:border-zine-rule-dark dark:text-zine-ink-soft-dark"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-zine-rule pt-6 text-center font-mono text-[11px] text-zine-ink-soft dark:border-zine-rule-dark dark:text-zine-ink-soft-dark">
        <p>&copy; {new Date().getFullYear()} Adi Rakhmatullah Ma'arif, S.Kom</p>
      </div>
    </div>
  </footer>
);
