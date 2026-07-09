import { experiences } from './experience';

export interface SystemLogEntry {
  year: number;
  level: 'SUCCESS' | 'WARNING' | 'INFO';
  message: string;
}

function extractStartYear(period: string): number {
  const match = period.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : new Date().getFullYear();
}

// Dibangun dari achievements nyata di experience.ts — bukan data rekaan.
// Pencapaian terakhir tiap entry ditandai INFO (rangkuman dampak), sisanya SUCCESS.
export const systemLog: SystemLogEntry[] = experiences.flatMap((exp) => {
  const year = extractStartYear(exp.period);
  return exp.achievements.map((message, i) => ({
    year,
    level: i === exp.achievements.length - 1 ? 'INFO' : 'SUCCESS',
    message,
  }));
}).sort((a, b) => a.year - b.year);
