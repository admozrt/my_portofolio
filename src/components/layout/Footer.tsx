import React from 'react';
import { Link } from 'react-router-dom';
import { contactInfo } from '../../data/contact';
import { Monogram } from '../ui/Monogram';

export const Footer: React.FC = () => {
  // Anchors on the main portfolio ("/") — this Footer is rendered on sub-pages
  // (e.g. /project-wedding), so links must navigate back to "/" first, not
  // just scrollIntoView an id that doesn't exist on the current page.
  // These ids track the zine homepage's sections, not the retired Control Room's.
  const quickLinks = [
    { label: 'Projek', id: 'projek' },
    { label: 'Skill', id: 'skill' },
    { label: 'Cara Kerja', id: 'softskill' },
    { label: 'Pengalaman', id: 'pengalaman' },
    { label: 'Kontak', id: 'kontak' },
  ];

  const techs = ['PHP','JavaScript', 'Golang', 'Laravel', 'React', 'React Native', 'TypeScript', 'MySQL', 'Postgree', 'Docker'];

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 py-14">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Monogram size={32} />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Adi Rakhmatullah Ma'arif
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              Software Engineer yang fokus mengubah masalah jadi solusi digital yang berjalan baik.
            </p>
            <div className="flex gap-2">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contact.label}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-accent-600 dark:hover:text-accent-400 hover:border-accent-500 transition-colors"
                >
                  {React.isValidElement(contact.icon)
                    ? React.cloneElement(contact.icon as React.ReactElement<{ className?: string }>, {
                        className: 'w-4 h-4',
                      })
                    : contact.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={`/#${link.id}`}
                    className="text-sm hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Teknologi
            </h4>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-mono border border-zinc-200 dark:border-zinc-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Adi Rakhmatullah Ma'arif, S.Kom</p>
        </div>
      </div>
    </footer>
  );
};
