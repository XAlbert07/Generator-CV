import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultCVData, defaultSectionOrder } from '@/types/cv';
import { useCVVersions } from '@/hooks/useCVVersions';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLayout } from '@/components/cv/mobile/MobileLayout';
import { VersionsManager } from '@/components/cv/VersionsManager';
import { PersonalInfoForm } from '@/components/cv/PersonalInfoForm';
import { ExperienceForm } from '@/components/cv/ExperienceForm';
import { EducationForm } from '@/components/cv/EducationForm';
import { SkillsForm } from '@/components/cv/SkillsForm';
import { ProjectsForm } from '@/components/cv/ProjectsForm';
import { CertificationsForm } from '@/components/cv/CertificationsForm';
import { TemplateSelector } from '@/components/cv/TemplateSelector';
import { LayoutOrganizer } from '@/components/cv/LayoutOrganizer';
import { CVPreview } from '@/components/cv/CVPreview';
import { CVCompletionIndicator } from '@/components/cv/CVCompletionIndicator';
import { PresetSelector } from '@/components/cv/PresetSelector';
import { DesktopFullPreview } from '@/components/cv/DesktopFullPreview';
import type { SmartPreset } from '@/lib/smartPresets';
import { SAMPLE_CV_DATA } from '@/lib/sampleData';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ExportDialog } from '@/components/cv/export/ExportDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Download, Eye, FileText, RotateCcw, Maximize2, Wand2, MoreVertical, Upload } from 'lucide-react';
import { generateId } from '@/lib/id';

import { toast } from 'sonner';

export default function CVGenerator() {
  const {
    versions,
    activeVersion,
    createVersion,
    duplicateVersion,
    renameVersion,
    deleteVersion,
    switchVersion,
    updateActiveVersionData,
    updateActiveVersion,
    updateActiveVersionTemplate,
    importVersions,
  } = useCVVersions();

  const cvData = activeVersion?.data || defaultCVData;
  const template = activeVersion?.template || 'modern';
  const sectionOrder = activeVersion?.sectionOrder || defaultSectionOrder;
  const targetRole = activeVersion?.targetRole || '';

  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const fillSampleData = () => {
    updateActiveVersionData(structuredClone(SAMPLE_CV_DATA));
    toast.success('Données d\'exemple chargées — explorez les templates !');
  };

  // Show preset selector for fresh/empty CVs
  const isEmptyCV = !cvData.personalInfo.firstName && !cvData.personalInfo.lastName
    && cvData.experiences.length === 0 && cvData.education.length === 0;
  const [presetDismissed, setPresetDismissed] = useState(false);
  const showPresetSelector = isEmptyCV && !presetDismissed;

  const handlePresetSelect = (preset: SmartPreset) => {
    updateActiveVersionTemplate(preset.recommendedTemplates[0]);
    updateActiveVersion({
      sectionOrder: preset.sectionOrder,
      targetRole: preset.label,
    });
    setPresetDismissed(true);
    toast.success(`Preset "${preset.label}" appliqué — template, sections et ordre configurés !`);
  };

  const handlePresetSkip = () => {
    setPresetDismissed(true);
  };

  // Helper functions pour mettre à jour les données
  const updatePersonalInfo = (info: Partial<typeof cvData.personalInfo>) => {
    updateActiveVersionData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, ...info },
    });
  };

  const addExperience = () => {
    updateActiveVersionData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
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
    });
  };

  const updateExperience = (id: string, data: any) => {
    updateActiveVersionData({
      ...cvData,
      experiences: cvData.experiences.map(exp =>
        exp.id === id ? { ...exp, ...data } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    updateActiveVersionData({
      ...cvData,
      experiences: cvData.experiences.filter(exp => exp.id !== id),
    });
  };

  const addEducation = () => {
    updateActiveVersionData({
      ...cvData,
      education: [
        ...cvData.education,
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
    });
  };

  const updateEducation = (id: string, data: any) => {
    updateActiveVersionData({
      ...cvData,
      education: cvData.education.map(edu =>
        edu.id === id ? { ...edu, ...data } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    updateActiveVersionData({
      ...cvData,
      education: cvData.education.filter(edu => edu.id !== id),
    });
  };

  const addSkill = () => {
    updateActiveVersionData({
      ...cvData,
      skills: [
        ...cvData.skills,
        { id: generateId(), name: '', level: 3 },
      ],
    });
  };

  const updateSkill = (id: string, data: any) => {
    updateActiveVersionData({
      ...cvData,
      skills: cvData.skills.map(skill =>
        skill.id === id ? { ...skill, ...data } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    updateActiveVersionData({
      ...cvData,
      skills: cvData.skills.filter(skill => skill.id !== id),
    });
  };

  const addLanguage = () => {
    updateActiveVersionData({
      ...cvData,
      languages: [
        ...cvData.languages,
        { id: generateId(), name: '', level: 'Intermédiaire' },
      ],
    });
  };

  const updateLanguage = (id: string, data: any) => {
    updateActiveVersionData({
      ...cvData,
      languages: cvData.languages.map(lang =>
        lang.id === id ? { ...lang, ...data } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    updateActiveVersionData({
      ...cvData,
      languages: cvData.languages.filter(lang => lang.id !== id),
    });
  };

  // Projects CRUD
  const addProject = () => {
    updateActiveVersionData({
      ...cvData,
      projects: [
        ...(cvData.projects || []),
        { id: generateId(), name: '', description: '', url: '' },
      ],
    });
  };

  const updateProject = (id: string, data: any) => {
    updateActiveVersionData({
      ...cvData,
      projects: (cvData.projects || []).map(p =>
        p.id === id ? { ...p, ...data } : p
      ),
    });
  };

  const removeProject = (id: string) => {
    updateActiveVersionData({
      ...cvData,
      projects: (cvData.projects || []).filter(p => p.id !== id),
    });
  };

  // Certifications CRUD
  const addCertification = () => {
    updateActiveVersionData({
      ...cvData,
      certifications: [
        ...(cvData.certifications || []),
        { id: generateId(), name: '', issuer: '', date: '', url: '' },
      ],
    });
  };

  const updateCertification = (id: string, data: any) => {
    updateActiveVersionData({
      ...cvData,
      certifications: (cvData.certifications || []).map(c =>
        c.id === id ? { ...c, ...data } : c
      ),
    });
  };

  const removeCertification = (id: string) => {
    updateActiveVersionData({
      ...cvData,
      certifications: (cvData.certifications || []).filter(c => c.id !== id),
    });
  };

  const resetCV = () => {
    updateActiveVersionData({
      personalInfo: {},
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
    } as any);
    toast.info('Version réinitialisée');
    setShowResetDialog(false);
  };

  // Calculate preview scale based on container width
  useEffect(() => {
    const updateScale = () => {
      const container = previewRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth - 32;
      const a4Width = 210 * 3.7795275591;
      const scale = Math.min(containerWidth / a4Width, 0.7);
      
      document.documentElement.style.setProperty('--preview-scale', String(scale));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [showPreview]);

  const defaultFileName = (
    `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_${activeVersion?.name || ''}`
  )
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Mon_CV';

  // Preset selector (for empty CVs)
  if (showPresetSelector) {
    return <PresetSelector onSelect={handlePresetSelect} onSkip={handlePresetSkip} />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <MobileLayout
        cvData={cvData}
        template={template}
        setTemplate={updateActiveVersionTemplate}
        sectionOrder={sectionOrder}
        setSectionOrder={(order) => updateActiveVersion({ sectionOrder: order })}
        targetRole={targetRole}
        setTargetRole={(value) => updateActiveVersion({ targetRole: value })}
        setCvData={updateActiveVersionData}
        updatePersonalInfo={updatePersonalInfo}
        addExperience={addExperience}
        updateExperience={updateExperience}
        removeExperience={removeExperience}
        addEducation={addEducation}
        updateEducation={updateEducation}
        removeEducation={removeEducation}
        addSkill={addSkill}
        updateSkill={updateSkill}
        removeSkill={removeSkill}
        addLanguage={addLanguage}
        updateLanguage={updateLanguage}
        removeLanguage={removeLanguage}
        resetCV={resetCV}
        versions={versions}
      activeVersion={activeVersion}
      onCreateVersion={createVersion}
      onDuplicateVersion={duplicateVersion}
      onRenameVersion={renameVersion}
      onDeleteVersion={deleteVersion}
      onSwitchVersion={switchVersion}
      defaultFileName={defaultFileName}
      />
    );
  }

  // Desktop Layout (original)
  return (
    <div className="min-h-screen bg-background">
      {/* Header — épuré */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                CV <span className="gradient-text">Pro</span>
              </span>
            </Link>
            
            <div className="h-5 w-px bg-border hidden sm:block" />
            
            {/* Versions Manager */}
            <VersionsManager
              versions={versions}
              activeVersion={activeVersion}
              onCreateVersion={createVersion}
              onDuplicateVersion={duplicateVersion}
              onRenameVersion={renameVersion}
              onDeleteVersion={deleteVersion}
              onSwitchVersion={switchVersion}
            />
          </div>

          <div className="flex items-center gap-2">
            <CVCompletionIndicator data={cvData} />

            {/* Toggle aperçu mobile/tablette */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? 'Formulaire' : 'Aperçu'}
            </Button>

            {/* Menu secondaire */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={fillSampleData}>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Remplir un exemple
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  // Export JSON inline
                  try {
                    const json = JSON.stringify({ _meta: { app: 'CV Pro', version: '2.0', exportDate: new Date().toISOString() }, versions }, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `cv-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    toast.success('Sauvegarde téléchargée');
                  } catch { toast.error("Erreur lors de l'export"); }
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Sauvegarder (JSON)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file'; input.accept = '.json';
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target?.result as string);
                        const vArr = data.versions || (Array.isArray(data) ? data : null);
                        if (vArr) { importVersions(vArr); toast.success('Données importées'); }
                        else toast.error('Format invalide');
                      } catch { toast.error('Fichier JSON invalide'); }
                    };
                    reader.readAsText(file);
                  };
                  input.click();
                }}>
                  <Upload className="w-4 h-4 mr-2" />
                  Restaurer (JSON)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowResetDialog(true)} className="text-destructive focus:text-destructive">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">Thème</span>
                    <ThemeToggle />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA principal */}
            <Button onClick={() => setShowExport(true)} size="sm">
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className={`flex-1 space-y-4 ${showPreview ? 'hidden lg:block' : ''}`}>
            <TemplateSelector selected={template} onChange={updateActiveVersionTemplate} />
            <LayoutOrganizer
              cvData={cvData}
              onCvDataChange={updateActiveVersionData}
              sectionOrder={sectionOrder}
              onSectionOrderChange={(order) => updateActiveVersion({ sectionOrder: order })}
              targetRole={targetRole}
              onTargetRoleChange={(value) => updateActiveVersion({ targetRole: value })}
            />
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 mb-4">
                <TabsTrigger value="personal" className="text-xs sm:text-sm">Profil</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs sm:text-sm">Expérience</TabsTrigger>
                <TabsTrigger value="education" className="text-xs sm:text-sm">Formation</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs sm:text-sm">Compétences</TabsTrigger>
                <TabsTrigger value="projects" className="text-xs sm:text-sm">Projets</TabsTrigger>
                <TabsTrigger value="certifications" className="text-xs sm:text-sm">Certif.</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <PersonalInfoForm
                  data={cvData.personalInfo}
                  onChange={updatePersonalInfo}
                />
              </TabsContent>
              
              <TabsContent value="experience">
                <ExperienceForm
                  experiences={cvData.experiences}
                  onAdd={addExperience}
                  onUpdate={updateExperience}
                  onRemove={removeExperience}
                />
              </TabsContent>
              
              <TabsContent value="education">
                <EducationForm
                  education={cvData.education}
                  onAdd={addEducation}
                  onUpdate={updateEducation}
                  onRemove={removeEducation}
                />
              </TabsContent>
              
              <TabsContent value="skills">
                <SkillsForm
                  skills={cvData.skills}
                  languages={cvData.languages}
                  onAddSkill={addSkill}
                  onUpdateSkill={updateSkill}
                  onRemoveSkill={removeSkill}
                  onAddLanguage={addLanguage}
                  onUpdateLanguage={updateLanguage}
                  onRemoveLanguage={removeLanguage}
                />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsForm
                  projects={cvData.projects || []}
                  onAdd={addProject}
                  onUpdate={updateProject}
                  onRemove={removeProject}
                />
              </TabsContent>

              <TabsContent value="certifications">
                <CertificationsForm
                  certifications={cvData.certifications || []}
                  onAdd={addCertification}
                  onUpdate={updateCertification}
                  onRemove={removeCertification}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div
            ref={previewRef}
            className={`lg:w-1/2 xl:w-2/5 ${!showPreview && 'hidden lg:block'}`}
          >
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Aperçu en direct</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullPreview(true)}
                  className="h-7 text-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 mr-1" />
                  Plein écran
                </Button>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 overflow-hidden" style={{ height: 'calc(100vh - 150px)' }}>
                <CVPreview data={cvData} template={template} sectionOrder={sectionOrder} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        cvData={cvData}
        template={template}
        visualElementId="cv-preview"
        defaultFilename={defaultFileName}
      />

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser cette version ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les informations saisies dans cette version seront supprimées.
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={resetCV} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Desktop Full-Screen Preview */}
      <DesktopFullPreview
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        data={cvData}
        template={template}
        sectionOrder={sectionOrder}
      />
    </div>
  );
}
