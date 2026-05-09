import React from 'react';
import type { CVData, CVTemplate, CVSectionId } from '@/types/cv';

export interface TemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

/**
 * Lazy-loaded template registry.
 * Each template is loaded only when selected, reducing initial bundle size.
 */
const TEMPLATE_REGISTRY: Record<CVTemplate, React.LazyExoticComponent<React.ComponentType<TemplateProps>>> = {
  modern: React.lazy(() => import('@/components/cv/templates/ModernTemplate').then(m => ({ default: m.ModernTemplate }))),
  classic: React.lazy(() => import('@/components/cv/templates/ClassicTemplate').then(m => ({ default: m.ClassicTemplate }))),
  creative: React.lazy(() => import('@/components/cv/templates/CreativeTemplate').then(m => ({ default: m.CreativeTemplate }))),
  executive: React.lazy(() => import('@/components/cv/templates/ExecutiveTemplate').then(m => ({ default: m.ExecutiveTemplate }))),
  minimalist: React.lazy(() => import('@/components/cv/templates/MinimalistTemplate').then(m => ({ default: m.MinimalistTemplate }))),
  professional: React.lazy(() => import('@/components/cv/templates/ProfessionalTemplate').then(m => ({ default: m.ProfessionalTemplate }))),
  corporate: React.lazy(() => import('@/components/cv/templates/CorporateTemplate').then(m => ({ default: m.CorporateTemplate }))),
  elegant: React.lazy(() => import('@/components/cv/templates/ElegantTemplate').then(m => ({ default: m.ElegantTemplate }))),
  ats: React.lazy(() => import('@/components/cv/templates/ATSTemplate').then(m => ({ default: m.ATSTemplate }))),
  swiss: React.lazy(() => import('@/components/cv/templates/SwissGridTemplate').then(m => ({ default: m.SwissGridTemplate }))),
  editorial: React.lazy(() => import('@/components/cv/templates/EditorialTemplate').then(m => ({ default: m.EditorialTemplate }))),
  techmono: React.lazy(() => import('@/components/cv/templates/TechMonoTemplate').then(m => ({ default: m.TechMonoTemplate }))),
  // New templates
  medical: React.lazy(() => import('@/components/cv/templates/MedicalTemplate').then(m => ({ default: m.MedicalTemplate }))),
  legal: React.lazy(() => import('@/components/cv/templates/LegalTemplate').then(m => ({ default: m.LegalTemplate }))),
  teacher: React.lazy(() => import('@/components/cv/templates/TeacherTemplate').then(m => ({ default: m.TeacherTemplate }))),
  commerce: React.lazy(() => import('@/components/cv/templates/CommerceTemplate').then(m => ({ default: m.CommerceTemplate }))),
  freelance: React.lazy(() => import('@/components/cv/templates/FreelanceTemplate').then(m => ({ default: m.FreelanceTemplate }))),
  student: React.lazy(() => import('@/components/cv/templates/StudentTemplate').then(m => ({ default: m.StudentTemplate }))),
  infographic: React.lazy(() => import('@/components/cv/templates/InfographicTemplate').then(m => ({ default: m.InfographicTemplate }))),
  prestige: React.lazy(() => import('@/components/cv/templates/PrestigeTemplate').then(m => ({ default: m.PrestigeTemplate }))),
  academic: React.lazy(() => import('@/components/cv/templates/AcademicTemplate').then(m => ({ default: m.AcademicTemplate }))),
  nordic: React.lazy(() => import('@/components/cv/templates/NordicTemplate').then(m => ({ default: m.NordicTemplate }))),
};

export function getTemplateComponent(template: CVTemplate): React.LazyExoticComponent<React.ComponentType<TemplateProps>> {
  return TEMPLATE_REGISTRY[template] ?? TEMPLATE_REGISTRY.modern;
}

export { TEMPLATE_REGISTRY };
