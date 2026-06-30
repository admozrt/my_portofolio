import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const USERNAME = 'admozrt';
const ACCENT = '2563eb'; // accent-600

const StatImage: React.FC<{ src: string; alt: string; delay: number }> = ({ src, alt, delay }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 bg-zinc-100 dark:bg-zinc-800 rounded-card text-xs text-zinc-400 dark:text-zinc-500">
        Tidak dapat memuat statistik GitHub
      </div>
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className="w-full rounded-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};

export const GithubActivity: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'default';
  const bgColor = isDark ? '18181b' : 'ffffff'; // zinc-900 / white
  const textColor = isDark ? 'e4e4e7' : '27272a'; // zinc-200 / zinc-800
  const borderColor = isDark ? '27272a' : 'e4e4e7'; // zinc-800 / zinc-200

  const heatmapUrl = `https://ghchart.rshah.org/${ACCENT}/${USERNAME}`;

  const statsUrl =
    `https://github-readme-stats.vercel.app/api?username=${USERNAME}` +
    `&show_icons=true&theme=${theme}` +
    `&bg_color=${bgColor}&text_color=${textColor}&border_color=${borderColor}` +
    `&icon_color=${ACCENT}&title_color=${ACCENT}` +
    `&hide_border=false&border_radius=16&count_private=true`;

  const streakUrl =
    `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}` +
    `&theme=${theme}&border_radius=16&hide_border=false` +
    `&background=${bgColor}&border=${borderColor}&stroke=${borderColor}` +
    `&ring=${ACCENT}&fire=${ACCENT}&currStreakNum=${textColor}&sideNums=${textColor}` +
    `&currStreakLabel=${ACCENT}&sideLabels=${textColor}&dates=71717a`;

  return (
    <motion.div
      className="mt-14 pt-10 border-t border-zinc-200 dark:border-zinc-800"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Github className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Aktivitas GitHub</h3>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs font-mono text-accent-600 dark:text-accent-400 hover:underline"
        >
          @{USERNAME}
        </a>
      </div>

      <div className="mb-4 overflow-hidden rounded-card border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <HeatmapImage src={heatmapUrl} isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatImage src={statsUrl} alt="GitHub Stats" delay={0.15} />
        <StatImage src={streakUrl} alt="GitHub Streak" delay={0.25} />
      </div>
    </motion.div>
  );
};

const HeatmapImage: React.FC<{ src: string; isDark: boolean }> = ({ src, isDark }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-zinc-400 dark:text-zinc-500">
        Tidak dapat memuat contribution graph
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Grafik kontribusi GitHub"
      loading="lazy"
      onError={() => setError(true)}
      className="w-full"
      style={{ filter: isDark ? 'invert(0.9) hue-rotate(180deg)' : 'none' }}
    />
  );
};
