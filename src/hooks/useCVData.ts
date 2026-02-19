import { useState, useEffect, useCallback } from 'react';
import { CVData, CVTemplate, defaultCVData } from '@/types/cv';
import { generateId } from '@/lib/id';

const STORAGE_KEY = 'cv-generator-data';
const TEMPLATE_KEY = 'cv-generator-template';

export function useCVData() {
  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultCVData;
      }
    }
    return defaultCVData;
  });

  const [template, setTemplate] = useState<CVTemplate>(() => {
    const saved = localStorage.getItem(TEMPLATE_KEY);
    return (saved as CVTemplate) || 'modern';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, template);
  }, [template]);

  const updatePersonalInfo = useCallback((info: Partial<CVData['personalInfo']>) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const addExperience = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: generateId(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    }));
  }, []);

  const updateExperience = useCallback((id: string, data: Partial<CVData['experiences'][0]>) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, ...data } : exp
      ),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  }, []);

  const addEducation = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: generateId(),
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));
  }, []);

  const updateEducation = useCallback((id: string, data: Partial<CVData['education'][0]>) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...data } : edu
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  }, []);

  const addSkill = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: generateId(), name: '', level: 3 },
      ],
    }));
  }, []);

  const updateSkill = useCallback((id: string, data: Partial<CVData['skills'][0]>) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, ...data } : skill
      ),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  }, []);

  const addLanguage = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: generateId(), name: '', level: 'Intermédiaire' },
      ],
    }));
  }, []);

  const updateLanguage = useCallback((id: string, data: Partial<CVData['languages'][0]>) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, ...data } : lang
      ),
    }));
  }, []);

  const removeLanguage = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id),
    }));
  }, []);

  const resetCV = useCallback(() => {
    setCVData(defaultCVData);
    setTemplate('modern');
  }, []);

  return {
    cvData,
    template,
    setTemplate,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addLanguage,
    updateLanguage,
    removeLanguage,
    resetCV,
  };
}
