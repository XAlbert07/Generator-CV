import { CVTemplate, CVSectionId } from '@/types/cv';

export interface SmartPreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  recommendedTemplates: CVTemplate[];
  enabledSections: CVSectionId[];
  sectionOrder: CVSectionId[];
  placeholders: {
    title?: string;
    summary?: string;
    experiencePosition?: string;
    experienceCompany?: string;
  };
}

export const SMART_PRESETS: SmartPreset[] = [
  {
    id: 'tech',
    label: 'Tech / Développement',
    emoji: '💻',
    description: 'Développeurs, ingénieurs, data scientists',
    recommendedTemplates: ['modern', 'techmono', 'infographic'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages', 'projects'],
    sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'languages'],
    placeholders: {
      title: 'Développeur Full-Stack',
      summary: 'Développeur passionné avec X ans d\'expérience en développement web...',
      experiencePosition: 'Développeur Full-Stack',
      experienceCompany: 'Tech Corp',
    },
  },
  {
    id: 'medical',
    label: 'Santé / Médical',
    emoji: '🏥',
    description: 'Médecins, infirmiers, pharmaciens',
    recommendedTemplates: ['medical', 'minimalist', 'ats'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
    sectionOrder: ['summary', 'certifications', 'experience', 'education', 'skills', 'languages'],
    placeholders: {
      title: 'Médecin généraliste',
      summary: 'Professionnel de santé avec X ans d\'expérience clinique...',
      experiencePosition: 'Médecin',
      experienceCompany: 'CHU',
    },
  },
  {
    id: 'legal',
    label: 'Juridique / Droit',
    emoji: '⚖️',
    description: 'Avocats, juristes, notaires',
    recommendedTemplates: ['legal', 'classic', 'executive'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
    sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills', 'languages'],
    placeholders: {
      title: 'Avocat en droit des affaires',
      summary: 'Juriste spécialisé avec X ans d\'expérience en...',
      experiencePosition: 'Avocat collaborateur',
      experienceCompany: 'Cabinet XYZ',
    },
  },
  {
    id: 'marketing',
    label: 'Marketing / Commercial',
    emoji: '📊',
    description: 'Marketing digital, vente, communication',
    recommendedTemplates: ['commerce', 'creative', 'infographic'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages', 'projects'],
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'languages'],
    placeholders: {
      title: 'Responsable Marketing Digital',
      summary: 'Professionnel du marketing avec expertise en acquisition et conversion...',
      experiencePosition: 'Chef de projet marketing',
      experienceCompany: 'Agence Marketing',
    },
  },
  {
    id: 'student',
    label: 'Étudiant / Premier emploi',
    emoji: '🎓',
    description: 'Stages, alternance, premier poste',
    recommendedTemplates: ['student', 'modern', 'nordic'],
    enabledSections: ['summary', 'education', 'experience', 'skills', 'languages', 'projects'],
    sectionOrder: ['summary', 'education', 'projects', 'experience', 'skills', 'languages'],
    placeholders: {
      title: 'Étudiant(e) en recherche de stage',
      summary: 'Étudiant(e) en Xème année de..., motivé(e) et rigoureux(se)...',
      experiencePosition: 'Stagiaire',
      experienceCompany: 'Entreprise',
    },
  },
  {
    id: 'design',
    label: 'Design / Créatif',
    emoji: '🎨',
    description: 'UI/UX, graphisme, direction artistique',
    recommendedTemplates: ['creative', 'swiss', 'freelance'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages', 'projects'],
    sectionOrder: ['summary', 'projects', 'skills', 'experience', 'education', 'languages'],
    placeholders: {
      title: 'Designer UX/UI',
      summary: 'Designer avec un œil pour le détail et une passion pour l\'utilisateur...',
      experiencePosition: 'UX/UI Designer',
      experienceCompany: 'Studio Créatif',
    },
  },
  {
    id: 'teaching',
    label: 'Enseignement / Académique',
    emoji: '📚',
    description: 'Professeurs, formateurs, chercheurs',
    recommendedTemplates: ['teacher', 'academic', 'classic'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
    sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills', 'languages'],
    placeholders: {
      title: 'Professeur de mathématiques',
      summary: 'Enseignant expérimenté avec X ans en éducation...',
      experiencePosition: 'Professeur',
      experienceCompany: 'Lycée / Université',
    },
  },
  {
    id: 'corporate',
    label: 'Entreprise / Corporate',
    emoji: '🏢',
    description: 'Management, RH, finance, conseil',
    recommendedTemplates: ['corporate', 'executive', 'professional'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages'],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages'],
    placeholders: {
      title: 'Directeur des opérations',
      summary: 'Manager expérimenté avec une expertise en gestion d\'équipe...',
      experiencePosition: 'Responsable de service',
      experienceCompany: 'Groupe International',
    },
  },
  {
    id: 'freelance',
    label: 'Freelance / Indépendant',
    emoji: '🎯',
    description: 'Consultants, travailleurs indépendants',
    recommendedTemplates: ['freelance', 'prestige', 'creative'],
    enabledSections: ['summary', 'experience', 'skills', 'languages', 'projects', 'certifications'],
    sectionOrder: ['summary', 'skills', 'projects', 'experience', 'certifications', 'languages'],
    placeholders: {
      title: 'Consultant indépendant',
      summary: 'Expert indépendant spécialisé en..., accompagnant les entreprises...',
      experiencePosition: 'Consultant / Mission',
      experienceCompany: 'Client',
    },
  },
  {
    id: 'general',
    label: 'Autre / Généraliste',
    emoji: '📋',
    description: 'Profil polyvalent, reconversion',
    recommendedTemplates: ['modern', 'professional', 'minimalist'],
    enabledSections: ['summary', 'experience', 'education', 'skills', 'languages'],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages'],
    placeholders: {
      title: 'Titre professionnel',
      summary: 'Professionnel motivé avec une expérience diversifiée...',
      experiencePosition: 'Poste occupé',
      experienceCompany: 'Entreprise',
    },
  },
];

export function getPresetById(id: string): SmartPreset | undefined {
  return SMART_PRESETS.find((p) => p.id === id);
}
