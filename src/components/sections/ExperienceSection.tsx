import React from 'react';
import { experiences } from '../../data/experience';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const ExperienceSection: React.FC = () => {
  return (
    <section id="pengalaman" className="py-20 md:py-28 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
            Riwayat Penugasan
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Pengalaman
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Perjalanan saya sebagai software engineer.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-2.5 md:left-3 top-2 bottom-2 w-px bg-ops-600/60 dark:bg-ops-500/60"
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative pl-10 md:pl-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: EASE }}
              >
                {/* Dot */}
                <motion.div
                  className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 border-2 border-ops-600 dark:border-ops-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.12 + 0.2, ease: EASE }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-ops-600 dark:bg-ops-500" />
                </motion.div>

                <div className="flex flex-col md:flex-row md:items-start gap-x-10 gap-y-4">
                  {/* Meta */}
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{exp.title}</h3>
                    <p className="text-ops-600 dark:text-ops-400 text-sm font-medium mb-3">{exp.company}</p>
                    <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:w-2/3">
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    <ul className="space-y-2 mb-5">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-ops-600 dark:bg-ops-500 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full font-mono text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
