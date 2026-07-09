import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { skills } from '../../data/skill';
import { projects } from '../../data/project';

function countProjectsUsing(skillName: string): number {
  const needle = skillName.toLowerCase();
  return projects.filter((p) =>
    p.technologies.some((t) => t.toLowerCase().includes(needle) || needle.includes(t.toLowerCase()))
  ).length;
}

export const TechControlPanel: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);

  const usageCounts = useMemo(() => {
    const map: Record<string, number> = {};
    skills.forEach((s) => {
      map[s.name] = countProjectsUsing(s.name);
    });
    return map;
  }, []);

  return (
    <section id="stack" className="relative bg-white dark:bg-zinc-900 py-20 px-6 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
            Panel Kontrol
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">Tech Stack Aktif</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skills.map((skill) => {
            const isActive = active === skill.name;
            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => setActive(isActive ? null : skill.name)}
                className="relative flex items-center gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-3 py-3 text-left hover:border-ops-600 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-ops-600 dark:bg-ops-500 shrink-0" />
                {skill.icon && (
                  <span className={`text-base shrink-0 ${skill.color || 'text-zinc-500 dark:text-zinc-400'}`}>
                    {typeof skill.icon === 'object' && 'iconName' in (skill.icon as any) ? (
                      <FontAwesomeIcon icon={skill.icon as any} />
                    ) : (
                      (skill.icon as React.ReactNode)
                    )}
                  </span>
                )}
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-200 truncate">{skill.name}</span>

                {isActive && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 shadow-lg">
                    <div className="font-mono text-[10px] text-zinc-500">
                      Level: <span className="text-ops-600 dark:text-ops-400">{skill.level}%</span>
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500">
                      Dipakai di <span className="text-ops-600 dark:text-ops-400">{usageCounts[skill.name]}</span> proyek
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
