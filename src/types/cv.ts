export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  summary: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}


export interface CVVersion {
  id: string;
  name: string;
  template: CVTemplate;
  data: CVData;
  createdAt: string;
  updatedAt: string;
}

export type CVTemplate = 'modern' | 'classic' | 'creative' | 'executive' | 'minimalist' | 'professional' | 'corporate' | 'elegant' | 'ats';

export const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    photo: null,
    summary: '',
    linkedin: '',
    website: '',
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
};


export const createNewVersion = (name: string, template: CVTemplate = 'modern'): CVVersion => ({
  id: crypto.randomUUID(),
  name,
  template,
  data: defaultCVData,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});