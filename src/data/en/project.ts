import type { Project } from '../../types';

/**
 * Terjemahan English untuk `src/data/project.ts`, per `id` projek.
 *
 * Hanya field yang berbeda yang ditulis. Nama produk yang memang nama diri
 * (Sinergi Health, TMU Ferry, SIPARBA, Core POS) tidak diterjemahkan; teknologi,
 * tautan, dan logo jatuh ke data asli.
 */
export const projectsEn: Partial<Record<number, Partial<Project>>> = {
  1: {
    description:
      'A medical records system that helps doctors and nurses manage patients, medical records, and clinic administration — patient registration, examinations, diagnoses, prescriptions, and reporting. Available on web, mobile, and desktop, and suited to main clinics, primary clinics, specialist practices, and community health centres.',
    domain: 'Healthcare',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Connected Facilities', value: '3+' },
      { label: 'Active Modules', value: '6' },
    ],
    logEntries: [
      { timestamp: '08:12', message: 'New patient registered' },
      { timestamp: '08:15', message: 'Medical records synced' },
      { timestamp: '08:20', message: 'Prescription issued' },
      { timestamp: '08:24', message: 'BPJS claim verified' },
    ],
  },
  2: {
    title: 'TMU Ferry - Ferry Ticketing Platform',
    description:
      'A complete ferry ticketing platform with real-time scheduling, an integrated payment gateway, and a responsive mobile interface, built to streamline sea transport for PT. Timur Mila Utama.',
    domain: 'Ferry Shipping Company',
    metrics: [
      { label: 'Uptime', value: '99.8%' },
      { label: 'Active Routes', value: '5+' },
      { label: 'Daily Transactions', value: '200+' },
    ],
    logEntries: [
      { timestamp: '09:01', message: 'Ferry ticket booked' },
      { timestamp: '09:03', message: 'Departure schedule updated' },
      { timestamp: '09:07', message: 'Gateway payment received' },
      { timestamp: '09:10', message: 'Passenger manifest synced' },
    ],
  },
  3: {
    title: 'SIPARBA - Banjarbaru Tourism Information System',
    description:
      'A web-based tourism information system with complete destination data, cultural events, and promotion of the tourism potential of Banjarbaru City.',
    domain: 'Tourism & Government',
    metrics: [
      { label: 'Uptime', value: '99.5%' },
      { label: 'Listed Destinations', value: '40+' },
      { label: 'Monthly Visitors', value: '5,000+' },
    ],
    logEntries: [
      { timestamp: '10:00', message: 'Destination data updated' },
      { timestamp: '10:05', message: 'Cultural event published' },
      { timestamp: '10:12', message: 'Visit statistics synced' },
    ],
  },
  10: {
    description:
      'A dynamic multi-sector point-of-sale system — one platform that is configured, not rebuilt, for Retail, F&B, Services, Pharmacy, and Cooperatives. Granular RBAC, FEFO stock, digital receipts, and a real-time dashboard.',
    domain: 'Multi-Sector Retail & SMEs',
    metrics: [
      { label: 'Access Roles', value: '6' },
      { label: 'Sector Templates', value: '5' },
      { label: 'No-Code Configuration', value: '100%' },
    ],
    logEntries: [
      { timestamp: '09:15', message: 'Checkout transaction recorded' },
      { timestamp: '09:20', message: 'FEFO stock updated' },
      { timestamp: '09:25', message: 'Digital receipt sent' },
    ],
  },
  5: {
    title: 'Digital Wedding Invitations',
    description:
      'A collection of wedding invitation microsites built as a personal project, each with its own visual theme, animation, and interactions (countdown, gallery, e-gift) designed for one specific couple.',
    domain: 'Creative & Personal',
    metrics: [
      { label: 'Active Invitations', value: '4' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Guests Served', value: '500+' },
    ],
    logEntries: [
      { timestamp: '11:00', message: 'New invitation published' },
      { timestamp: '11:05', message: 'Guest RSVP received' },
      { timestamp: '11:10', message: 'Wishes sent' },
    ],
  },
  4: {
    title: 'Quality Indicator Management System',
    description:
      'Records Quality Indicators (QI) and Patient Safety Incidents (PSI) in every unit and installation. Daily results roll up automatically into monthly figures for monitoring and reporting.',
    domain: 'Healthcare',
    metrics: [
      { label: 'Uptime', value: '99.6%' },
      { label: 'Connected Units', value: '12+' },
      { label: 'Monthly Reports', value: '30+' },
    ],
    logEntries: [
      { timestamp: '07:45', message: 'New incident recorded' },
      { timestamp: '07:50', message: 'Quality indicators compiled' },
      { timestamp: '08:00', message: 'Monthly report generated' },
    ],
  },
  6: {
    title: 'Military Instructor Payroll System',
    description:
      'A payroll management system for military personnel with automatic calculation, financial reporting, and integration with the personnel database.',
    domain: 'Government',
    metrics: [
      { label: 'Uptime', value: '99.7%' },
      { label: 'Personnel on Record', value: '300+' },
      { label: 'Payslips / Month', value: '300+' },
    ],
    logEntries: [
      { timestamp: '06:30', message: 'Personnel data synced' },
      { timestamp: '06:40', message: 'Payroll calculation completed' },
      { timestamp: '06:50', message: 'Payslips issued' },
    ],
  },
  7: {
    title: 'School Management System',
    description:
      'An integrated education management platform covering academic administration, student management, scheduling, and comprehensive reporting.',
    domain: 'Education',
    metrics: [
      { label: 'Uptime', value: '99.4%' },
      { label: 'Students on Record', value: '500+' },
      { label: 'Academic Modules', value: '8' },
    ],
    logEntries: [
      { timestamp: '07:00', message: 'Class schedule updated' },
      { timestamp: '07:10', message: 'Student grades compiled' },
      { timestamp: '07:20', message: 'Academic report generated' },
    ],
  },
  8: {
    title: 'Digital Attendance System',
    description:
      'A geolocation-based attendance app with real-time tracking, workplace validation, and analytics reporting to streamline HR.',
    domain: 'HR & Operations',
    metrics: [
      { label: 'Uptime', value: '99.3%' },
      { label: 'Active Locations', value: '10+' },
      { label: 'Daily Check-ins', value: '150+' },
    ],
    logEntries: [
      { timestamp: '06:55', message: 'Check-in recorded' },
      { timestamp: '07:00', message: 'Location validated' },
      { timestamp: '17:05', message: 'Check-out recorded' },
    ],
  },
  9: {
    title: 'Universitas Borneo Lestari Asset Management',
    description:
      'A digital asset and archive management system with automatic categorisation, smart search, QR-scan asset lending, and distributed backups for long-term data preservation.',
    domain: 'Education',
    metrics: [
      { label: 'Uptime', value: '99.5%' },
      { label: 'Assets on Record', value: '2,000+' },
      { label: 'Loans / Month', value: '50+' },
    ],
    logEntries: [
      { timestamp: '08:30', message: 'New asset registered' },
      { timestamp: '08:40', message: 'Asset QR scanned' },
      { timestamp: '08:50', message: 'Asset loan approved' },
    ],
  },
};
