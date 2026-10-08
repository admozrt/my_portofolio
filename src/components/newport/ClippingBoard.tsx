import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useProjects } from '../../hooks/useLocalizedData';
import { useLang } from '../../hooks/useLang';
import type { Project } from '../../types';
import { ClippingCard } from './ClippingCard';
import { ClippingSlider } from './ClippingSlider';
import { ProjectSheet } from './ProjectSheet';
import { REVEAL } from './motion';

/** Fixed per position so the board looks arranged by hand, not randomised each render. */
const LARGE_TILT = [-2.2, 1.6, -1, 2, -1.6];
const SMALL_TILT = [1.4, -1.8, 2.2, -1.2, 1.8];

export const ClippingBoard: React.FC = () => {
  const reduce = useReducedMotion();
  const { t } = useLang();
  const projects = useProjects();
  /* Yang disimpan id-nya, bukan objeknya: kalau bahasa diganti saat lembar
     detail terbuka, objek lama masih berbahasa sebelumnya. */
  const [openId, setOpenId] = useState<number | null>(null);
  const openProject = projects.find((p) => p.id === openId) ?? null;
  const setOpenProject = (p: Project) => setOpenId(p.id);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projek" className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="mb-8 flex flex-wrap items-baseline justify-between gap-3"
      >
        <h2 className="np-hand text-[28px] text-zine-ink dark:text-zine-ink-dark sm:text-[36px]">
          {t.projects.heading}
        </h2>
        <p className="max-w-[40ch] text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
          {t.projects.intro}
        </p>
      </motion.div>

      <ClippingSlider
        label={t.projects.featured}
        slideClassName="w-[70%] sm:w-[40%] md:w-[31%] lg:w-[24%] xl:w-[20%] p-4"
      >
        {featured.map((project, i) => (
          <ClippingCard
            key={project.id}
            project={project}
            index={i}
            size="large"
            tilt={LARGE_TILT[i % LARGE_TILT.length]}
            onOpen={setOpenProject}
          />
        ))}
      </ClippingSlider>

      <motion.h3
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="mb-1 mt-12 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zine-ink-soft dark:text-zine-ink-soft-dark"
      >
        {t.projects.other}
      </motion.h3>

      <ClippingSlider
        label={t.projects.other}
        slideClassName="w-[48%] sm:w-[31%] lg:w-[20%] p-2"
      >
        {rest.map((project, i) => (
          <ClippingCard
            key={project.id}
            project={project}
            index={i}
            size="small"
            tilt={SMALL_TILT[i % SMALL_TILT.length]}
            onOpen={setOpenProject}
          />
        ))}
      </ClippingSlider>

      <ProjectSheet project={openProject} onClose={() => setOpenId(null)} />
    </section>
  );
};
