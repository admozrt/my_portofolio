import { projects } from '../data/project';
import { experiences } from '../data/experience';
import { softSkills } from '../data/softSkill';
import { partners } from '../data/partner';
import { transformationChapters } from '../data/transformationChapters';
import { complianceCards } from '../data/complianceCards';
import { projectsEn } from '../data/en/project';
import { experiencesEn } from '../data/en/experience';
import { softSkillsEn } from '../data/en/softSkill';
import { partnersEn } from '../data/en/partner';
import { transformationChaptersEn } from '../data/en/transformationChapters';
import { complianceCardsEn } from '../data/en/complianceCards';
import { useLocalized } from './useLocalized';

/** Data siap pakai sesuai bahasa aktif. Satu hook per himpunan data, supaya
 *  komponen tidak perlu tahu di mana terjemahannya disimpan. */
export const useProjects = () => useLocalized(projects, projectsEn, (p) => p.id);
export const useExperiences = () => useLocalized(experiences, experiencesEn, (e) => e.id);
export const useSoftSkills = () => useLocalized(softSkills, softSkillsEn, (s) => s.name);
export const usePartners = () => useLocalized(partners, partnersEn, (p) => p.id);
export const useTransformationChapters = () =>
  useLocalized(transformationChapters, transformationChaptersEn, (c) => c.id);
export const useComplianceCards = () =>
  useLocalized(complianceCards, complianceCardsEn, (c) => c.referenceNumber);
