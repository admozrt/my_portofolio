import type { TransformationChapter } from '../transformationChapters';

/** Terjemahan English untuk `src/data/transformationChapters.ts`, per `id` bab. */
export const transformationChaptersEn: Partial<Record<string, Partial<TransformationChapter>>> = {
  'sinergi-health': {
    beforeProblem: 'Medical records and patient queues were still kept by hand on paper',
    beforeDescription:
      'Staff recorded patient data, treatment history, and prescriptions by hand in separate books — easy to lose, and slow to pull together when needed again.',
    afterMetrics: [
      { label: 'Less Time Spent Recording', value: 80, suffix: '%' },
      { label: 'Integrated Modules', value: 6 },
      { label: 'Connected Facilities', value: 3, suffix: '+' },
    ],
  },
  'tmu-ferry': {
    beforeProblem: 'Ferry tickets were still booked by phone or at the counter',
    beforeDescription:
      'Passengers had to call or visit the counter to check schedules and book — prone to schedule clashes and hard to monitor in real time.',
    afterMetrics: [
      { label: 'Faster Booking', value: 75, suffix: '%' },
      { label: 'Scheduled Active Routes', value: 5, suffix: '+' },
      { label: 'Daily Transactions', value: 200, suffix: '+' },
    ],
  },
  siparba: {
    beforeProblem: 'Tourism and cultural information was scattered and hard for visitors to reach',
    beforeDescription:
      'Destination data and cultural events were kept separately across agencies — there was no single official portal the public could easily use.',
    afterMetrics: [
      { label: 'Destinations Online', value: 40, suffix: '+' },
      { label: 'Information Access', value: 24, suffix: '/7' },
      { label: 'Wider Promotional Reach', value: 60, suffix: '%' },
    ],
  },
  'rsj-indikator-mutu': {
    beforeProblem: 'Quality indicators and safety incidents were logged by hand in each unit',
    beforeDescription:
      'Each unit and installation recorded results and incidents separately — hard to roll up into a consistent, on-time monthly report.',
    afterMetrics: [
      { label: 'Faster Monthly Reporting', value: 70, suffix: '%' },
      { label: 'Connected Units', value: 12, suffix: '+' },
      { label: 'Automated Reports / Month', value: 30, suffix: '+' },
    ],
  },
  'wedding-microsites': {
    beforeProblem: 'Digital invitations usually rely on the same uniform templates',
    beforeDescription:
      'Most online invitation platforms offer every couple the same templates — leaving little room to personalise the story or the visuals.',
    afterMetrics: [
      { label: 'Custom Themes Built from Scratch', value: 4 },
      { label: 'Unique Interactions per Couple', value: 6, suffix: '+' },
      { label: 'Visual Personalisation', value: 100, suffix: '%' },
    ],
  },
  corepos: {
    beforeProblem: 'Businesses across sectors were stuck forcing a generic POS to fit',
    beforeDescription:
      'Retail, F&B, services, pharmacies, and cooperatives each have different transaction flows — most off-the-shelf POS systems force every sector into one flow, or are expensive to customise.',
    afterMetrics: [
      { label: 'Ready-to-Use Sector Templates', value: 5 },
      { label: 'Granular Access Roles', value: 6 },
      { label: 'No-Code Configuration', value: 100, suffix: '%' },
    ],
  },
};
