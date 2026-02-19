import { useState, useEffect, useCallback } from 'react';
import {
  CVVersion,
  CVData,
  CVTemplate,
  createNewVersion,
  defaultCVData,
  defaultSectionOrder,
} from '@/types/cv';
import { generateId } from '@/lib/id';

const VERSIONS_KEY = 'cv-versions';
const ACTIVE_VERSION_KEY = 'cv-active-version-id';

export function useCVVersions() {
  const normalizeVersions = useCallback((raw: unknown): CVVersion[] => {
    if (!Array.isArray(raw)) return [];

    return raw
      .map((v: any): CVVersion | null => {
        if (!v || typeof v !== 'object') return null;

        const id = typeof v.id === 'string' ? v.id : generateId();
        const name = typeof v.name === 'string' ? v.name : 'Mon CV';
        const template = (typeof v.template === 'string' ? v.template : 'modern') as CVTemplate;

        // Data
        const data: CVData = v.data && typeof v.data === 'object'
          ? {
              personalInfo: { ...defaultCVData.personalInfo, ...(v.data.personalInfo || {}) },
              experiences: Array.isArray(v.data.experiences) ? v.data.experiences : [],
              education: Array.isArray(v.data.education) ? v.data.education : [],
              skills: Array.isArray(v.data.skills) ? v.data.skills : [],
              languages: Array.isArray(v.data.languages) ? v.data.languages : [],
            }
          : structuredClone(defaultCVData);

        // Layout/meta (optional)
        const targetRole = typeof v.targetRole === 'string' ? v.targetRole : '';
        const sectionOrder = Array.isArray(v.sectionOrder) && v.sectionOrder.length
          ? v.sectionOrder
          : defaultSectionOrder;

        const createdAt = typeof v.createdAt === 'string' ? v.createdAt : new Date().toISOString();
        const updatedAt = typeof v.updatedAt === 'string' ? v.updatedAt : new Date().toISOString();

        return {
          id,
          name,
          template,
          data,
          targetRole,
          sectionOrder,
          createdAt,
          updatedAt,
        };
      })
      .filter(Boolean) as CVVersion[];
  }, []);

  // Charger les versions depuis localStorage
  const [versions, setVersions] = useState<CVVersion[]>(() => {
    const saved = localStorage.getItem(VERSIONS_KEY);
    if (saved) {
      try {
        return normalizeVersions(JSON.parse(saved));
      } catch {
        return [];
      }
    }
    // Créer une version par défaut si aucune n'existe
    const defaultVersion = createNewVersion('Mon CV Principal', 'modern');
    return [defaultVersion];
  });

  const [activeVersionId, setActiveVersionId] = useState<string>(() => {
    const saved = localStorage.getItem(ACTIVE_VERSION_KEY);
    if (saved && versions.find(v => v.id === saved)) {
      return saved;
    }
    return versions[0]?.id || '';
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_VERSION_KEY, activeVersionId);
  }, [activeVersionId]);

  // Récupérer la version active
  const activeVersion = versions.find(v => v.id === activeVersionId) || versions[0];

  // Créer une nouvelle version
  const createVersion = useCallback((name: string, template: CVTemplate = 'modern') => {
    const newVersion = createNewVersion(name, template);
    setVersions(prev => [...prev, newVersion]);
    setActiveVersionId(newVersion.id);
    return newVersion;
  }, []);

  // Dupliquer une version existante
  const duplicateVersion = useCallback((versionId: string, newName?: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;

    const duplicated: CVVersion = {
      ...version,
      id: generateId(),
      name: newName || `${version.name} (copie)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVersions(prev => [...prev, duplicated]);
    setActiveVersionId(duplicated.id);
  }, [versions]);

  // Mettre à jour une version
  const updateVersion = useCallback((versionId: string, updates: Partial<CVVersion>) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId 
        ? { ...v, ...updates, updatedAt: new Date().toISOString() }
        : v
    ));
  }, []);

  // Renommer une version
  const renameVersion = useCallback((versionId: string, newName: string) => {
    updateVersion(versionId, { name: newName });
  }, [updateVersion]);

  // Supprimer une version
  const deleteVersion = useCallback((versionId: string) => {
    if (versions.length <= 1) {
      alert('Vous devez garder au moins une version');
      return;
    }

    setVersions(prev => {
      const filtered = prev.filter(v => v.id !== versionId);
      // Si on supprime la version active, activer la première
      if (versionId === activeVersionId) {
        setActiveVersionId(filtered[0].id);
      }
      return filtered;
    });
  }, [versions.length, activeVersionId]);

  // Changer de version active
  const switchVersion = useCallback((versionId: string) => {
    if (versions.find(v => v.id === versionId)) {
      setActiveVersionId(versionId);
    }
  }, [versions]);

  // Mettre à jour les données de la version active
  const updateActiveVersionData = useCallback((data: CVData) => {
    if (activeVersion) {
      updateVersion(activeVersion.id, { data });
    }
  }, [activeVersion, updateVersion]);

  // Mettre à jour les métadonnées / layout de la version active
  const updateActiveVersion = useCallback((updates: Partial<CVVersion>) => {
    if (activeVersion) {
      updateVersion(activeVersion.id, updates);
    }
  }, [activeVersion, updateVersion]);

  // Mettre à jour le template de la version active
  const updateActiveVersionTemplate = useCallback((template: CVTemplate) => {
    if (activeVersion) {
      updateVersion(activeVersion.id, { template });
    }
  }, [activeVersion, updateVersion]);

  return {
    versions,
    activeVersion,
    activeVersionId,
    createVersion,
    duplicateVersion,
    renameVersion,
    deleteVersion,
    switchVersion,
    updateActiveVersionData,
    updateActiveVersion,
    updateActiveVersionTemplate,
  };
}
