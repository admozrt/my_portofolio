import type { ComplianceCard } from '../complianceCards';

/**
 * Terjemahan English untuk `src/data/complianceCards.ts`, per `referenceNumber`.
 * Label stempel (IMPLEMENTED/COMPLIANT/SECURED) sudah English di data asli.
 */
export const complianceCardsEn: Partial<Record<string, Partial<ComplianceCard>>> = {
  'DOC-2026-01': {
    title: 'RBAC & Data Security',
    shortDescription:
      'Role-based access control ensures each user can only reach the data their role allows.',
    detailDescription:
      'Every system I build separates roles (e.g. admin, staff, patient/user) with authorisation enforced on the backend, not merely hidden in the interface.',
  },
  'DOC-2026-02': {
    title: 'Standards Integration (SATUSEHAT/HL7 FHIR)',
    shortDescription:
      'Healthcare systems I build integrate with the national interoperability standards.',
    detailDescription:
      'In the Sinergi Health Baimbai - RME project, the system connects to SatuSehat and BPJS in line with the applicable national healthcare integration requirements.',
  },
  'DOC-2026-03': {
    title: 'Secure Server Management',
    shortDescription:
      'Server infrastructure is managed with network security practices that never expose direct access to the public.',
    detailDescription:
      'Administrative access to servers goes through private channels (e.g. VPN/Tailscale) rather than publicly exposed ports, to reduce the attack surface.',
  },
  'DOC-2026-04': {
    title: 'Payment Gateway Integration',
    shortDescription:
      'Payments are processed through licensed payment gateways, never handled manually.',
    detailDescription:
      'In the TMU Ferry project (PT. Timur Mila Utama), ferry ticket payments integrate with Midtrans, Xendit, and Bank BCA. In the BPPRD Banjarbaru City project, regional tax and levy payments integrate with Bank Kalsel.',
  },
};
