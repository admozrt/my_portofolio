import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const USERNAME = 'admozrt';

const StatImage: React.FC<{ src: string; alt: string; delay: number }> = ({ src, alt, delay }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs text-gray-400 dark:text-gray-500">
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
      className="w-full rounded-xl"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
    />
  );
};

export const GithubActivity: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? 'dark' : 'default';
  const bgColor = isDark ? '1f2937' : 'ffffff';
  const textColor = isDark ? 'e5e7eb' : '374151';
  const borderColor = isDark ? '374151' : 'e5e7eb';

  const heatmapUrl = `https://ghchart.rshah.org/1a56db/${USERNAME}`;

  const statsUrl =
    `https://github-readme-stats.vercel.app/api?username=${USERNAME}` +
    `&show_icons=true&theme=${theme}` +
    `&bg_color=${bgColor}&text_color=${textColor}&border_color=${borderColor}` +
    `&hide_border=false&border_radius=12&count_private=true`;

  const streakUrl =
    `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}` +
    `&theme=${theme}&border_radius=12` +
    `&background=${bgColor}&ring=1a56db&fire=1a56db&currStreakLabel=${textColor}`;

  return (
    <motion.div
      className="mt-10 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">GitHub Activity</h3>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-blue-500 hover:underline"
        >
          @{USERNAME}
        </a>
      </div>

      {/* Heatmap */}
      <motion.div
        className="mb-4 overflow-hidden rounded-xl bg-white dark:bg-gray-900 p-3"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <HeatmapImage src={heatmapUrl} isDark={isDark} />
      </motion.div>

      {/* Stats + Streak side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatImage src={statsUrl} alt="GitHub Stats" delay={0.2} />
        <StatImage src={streakUrl} alt="GitHub Streak" delay={0.3} />
      </div>
    </motion.div>
  );
};

const HeatmapImage: React.FC<{ src: string; isDark: boolean }> = ({ src, isDark }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-gray-400 dark:text-gray-500">
        Tidak dapat memuat contribution graph
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="GitHub Contribution Graph"
      loading="lazy"
      onError={() => setError(true)}
      className="w-full"
      style={{ filter: isDark ? 'invert(0.85) hue-rotate(180deg)' : 'none' }}
    />
  );
};
