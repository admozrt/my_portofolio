import type { Partner } from '../../types';

/** Terjemahan English untuk `src/data/partner.ts`, per `id`. Nama instansi tidak diterjemahkan. */
export const partnersEn: Partial<Record<number, Partial<Partner>>> = {
  1: {
    description: 'A specialist psychiatric hospital providing comprehensive mental health services',
    relationship: 'Developer - Hospital Information System',
  },
  2: {
    description: 'A hardware supplier and software house',
    relationship: 'System Builder & Developer',
  },
  3: {
    description:
      'PT. Timur Mila Utama operates in shipping and sea transport, providing passenger crossings by ferry and Roll-On/Roll-Off (RoRo) vessels',
    relationship: 'System Builder & Developer - Ferry Ticketing Platform',
  },
  4: {
    description: 'Regional Tax and Levy Management Agency of Banjarbaru City',
    relationship: 'System Developer',
  },
  5: {
    description: 'Department of Youth, Sports, Culture, and Tourism of Banjarbaru City',
    relationship: 'System Builder & Developer - Tourism Information Platform',
  },
  6: {
    description:
      'A loading and unloading services company at the Port of Gresik, supporting national shipping operations',
    relationship: 'System Developer',
  },
  7: {
    description: 'Regional Military Command of the Indonesian National Armed Forces',
    relationship: 'Builder - Military Instructor Payroll System',
  },
  8: {
    name: 'Laravel Community',
    description: 'Active contributor to the Laravel ecosystem and community',
    relationship: 'Community Member & Contributor',
  },
};
