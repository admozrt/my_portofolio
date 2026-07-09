import React from 'react';
import { contactInfo } from '../../data/contact';
import { Monogram } from '../ui/Monogram';

export const ControlRoomFooter: React.FC = () => {
  const quickLinks = [
    { label: 'Monitor', id: 'monitor' },
    { label: 'Stack', id: 'stack' },
    { label: 'Log', id: 'log' },
    { label: 'Transmisi', id: 'transmisi' },
    { label: 'Kontak', id: 'kontak' },
  ];

  const techs = ['PHP', 'JavaScript', 'Golang', 'Laravel', 'React', 'React Native', 'TypeScript', 'MySQL', 'Postgree', 'Docker'];

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500 py-14">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Monogram size={32} strokeClassName="stroke-ops-600 dark:stroke-ops-500" />
              <h3 className="font-mono text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Adi Rakhmatullah Ma'arif
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs text-zinc-500">
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
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-ops-600 dark:hover:text-ops-400 hover:border-ops-600 transition-colors"
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

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-600 mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() =>
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="font-mono text-sm text-zinc-500 dark:text-zinc-400 hover:text-ops-600 dark:hover:text-ops-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-600 mb-4">
              Teknologi
            </h4>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center font-mono text-xs text-zinc-400 dark:text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Adi Rakhmatullah Ma'arif, S.Kom</p>
        </div>
      </div>
    </footer>
  );
};
