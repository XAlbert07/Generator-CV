import { CVData } from '@/types/cv';
import { generateId } from '@/lib/id';

export const SAMPLE_CV_DATA: CVData = {
  personalInfo: {
    firstName: 'Sophie',
    lastName: 'Martin',
    title: 'Développeuse Full-Stack Senior',
    email: 'sophie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    address: 'Paris, France',
    photo: null,
    summary:
      'Développeuse passionnée avec 7 ans d\'expérience en développement web et mobile. Expertise en React, Node.js et architecture cloud. Reconnue pour ma capacité à transformer des idées complexes en solutions élégantes et performantes. Leadership technique d\'équipes de 5 à 12 personnes.',
    linkedin: 'linkedin.com/in/sophie-martin',
    website: 'sophiemartin.dev',
  },
  experiences: [
    {
      id: generateId(),
      company: 'TechVision',
      position: 'Lead Développeuse Full-Stack',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description:
        '• Architecture et développement d\'une plateforme SaaS (React, Node.js, PostgreSQL)\n• Management technique d\'une équipe de 8 développeurs\n• Mise en place du CI/CD et réduction du temps de déploiement de 60%\n• Migration de l\'infrastructure vers AWS (ECS, RDS, S3)',
    },
    {
      id: generateId(),
      company: 'DataFlow',
      position: 'Développeuse Full-Stack',
      startDate: '2018-09',
      endDate: '2021-02',
      current: false,
      description:
        '• Développement d\'APIs RESTful et GraphQL en Node.js/Express\n• Création d\'interfaces utilisateur réactives avec React et TypeScript\n• Optimisation des performances : temps de chargement réduit de 40%\n• Intégration de systèmes de paiement (Stripe, PayPal)',
    },
    {
      id: generateId(),
      company: 'WebAgency Plus',
      position: 'Développeuse Front-End',
      startDate: '2017-01',
      endDate: '2018-08',
      current: false,
      description:
        '• Développement de sites web responsifs pour des clients grands comptes\n• Création de composants réutilisables et d\'un design system interne\n• Collaboration étroite avec les designers UX/UI',
    },
  ],
  education: [
    {
      id: generateId(),
      school: 'École 42',
      degree: 'Architecte en Technologies du Numérique',
      field: 'Informatique',
      startDate: '2014-09',
      endDate: '2017-06',
      description: 'Pédagogie par projets — spécialisation en développement web et systèmes distribués',
    },
    {
      id: generateId(),
      school: 'Université Paris-Saclay',
      degree: 'Licence',
      field: 'Mathématiques-Informatique',
      startDate: '2011-09',
      endDate: '2014-06',
      description: '',
    },
  ],
  skills: [
    { id: generateId(), name: 'React / Next.js', level: 5 },
    { id: generateId(), name: 'TypeScript', level: 5 },
    { id: generateId(), name: 'Node.js', level: 4 },
    { id: generateId(), name: 'PostgreSQL', level: 4 },
    { id: generateId(), name: 'AWS / Cloud', level: 4 },
    { id: generateId(), name: 'Docker / CI-CD', level: 3 },
    { id: generateId(), name: 'Figma / UI Design', level: 3 },
    { id: generateId(), name: 'Python', level: 3 },
  ],
  languages: [
    { id: generateId(), name: 'Français', level: 'Natif' },
    { id: generateId(), name: 'Anglais', level: 'Courant' },
    { id: generateId(), name: 'Espagnol', level: 'Intermédiaire' },
  ],
  projects: [
    {
      id: generateId(),
      name: 'TaskFlow — Gestionnaire de projets',
      description: 'Application SaaS de gestion de projets avec Kanban, Gantt et collaboration en temps réel. +2000 utilisateurs actifs.',
      url: 'github.com/sophie/taskflow',
    },
    {
      id: generateId(),
      name: 'EcoTrack — Suivi empreinte carbone',
      description: 'Application mobile React Native permettant de suivre et réduire son empreinte carbone quotidienne.',
      url: 'ecotrack.app',
    },
  ],
  certifications: [
    {
      id: generateId(),
      name: 'AWS Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-05',
      url: '',
    },
    {
      id: generateId(),
      name: 'Google Professional Cloud Developer',
      issuer: 'Google Cloud',
      date: '2022-11',
      url: '',
    },
  ],
};
