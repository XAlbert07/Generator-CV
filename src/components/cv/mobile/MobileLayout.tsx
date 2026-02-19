import { useMemo, useState } from 'react';
import { CVData, CVTemplate, type CVSectionId, type CVVersion } from '@/types/cv';
import { PersonalInfoForm } from '@/components/cv/PersonalInfoForm';
import { ExperienceForm } from '@/components/cv/ExperienceForm';
import { EducationForm } from '@/components/cv/EducationForm';
import { SkillsForm } from '@/components/cv/SkillsForm';
import { TemplateSelector } from '@/components/cv/TemplateSelector';
import { LayoutOrganizer } from '@/components/cv/LayoutOrganizer';
import { FullScreenPreview } from '@/components/cv/mobile/FullScreenPreview';
import { MobileVersionsPanel } from '@/components/cv/mobile/MobileVersionsPanel';
import { ExportDialog } from '@/components/cv/export/ExportDialog';
import { ModernTemplate } from '@/components/cv/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/cv/templates/ClassicTemplate';
import { CreativeTemplate } from '@/components/cv/templates/CreativeTemplate';
import { ExecutiveTemplate } from '@/components/cv/templates/ExecutiveTemplate';
import { MinimalistTemplate } from '@/components/cv/templates/MinimalistTemplate';
import { ProfessionalTemplate } from '@/components/cv/templates/ProfessionalTemplate';
import { CorporateTemplate } from '@/components/cv/templates/CorporateTemplate';
import { ElegantTemplate } from '@/components/cv/templates/ElegantTemplate';
import { ATSTemplate } from '@/components/cv/templates/ATSTemplate';
import { SwissGridTemplate } from '@/components/cv/templates/SwissGridTemplate';
import { EditorialTemplate } from '@/components/cv/templates/EditorialTemplate';
import { TechMonoTemplate } from '@/components/cv/templates/TechMonoTemplate';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Download, Eye, FolderOpen, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

type MobileWizardStepId = 'profile' | 'experience' | 'details' | 'style' | 'preview';

type StepChecklistItem = {
  label: string;
  done: boolean;
  required?: boolean;
};

type StepConfig = {
  id: MobileWizardStepId;
  title: string;
  description: string;
};

const MOBILE_STEPS: StepConfig[] = [
  {
    id: 'profile',
    title: 'Profil',
    description: 'Renseigne les informations minimales pour générer un CV exploitable.',
  },
  {
    id: 'experience',
    title: 'Expérience',
    description: 'Ajoute ton parcours professionnel, même court.',
  },
  {
    id: 'details',
    title: 'Formation & compétences',
    description: 'Complète la partie académie, compétences et langues.',
  },
  {
    id: 'style',
    title: 'Style & structure',
    description: 'Choisis le template et l’ordre des sections.',
  },
  {
    id: 'preview',
    title: 'Aperçu & export',
    description: 'Vérifie le rendu final et exporte en PDF.',
  },
];

interface MobileLayoutProps {
  cvData: CVData;
  template: CVTemplate;
  setTemplate: (template: CVTemplate) => void;
  sectionOrder: CVSectionId[];
  setSectionOrder: (order: CVSectionId[]) => void;
  targetRole: string;
  setTargetRole: (value: string) => void;
  setCvData: (data: CVData) => void;
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<CVData['experiences'][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<CVData['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<CVData['skills'][0]>) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<CVData['languages'][0]>) => void;
  removeLanguage: (id: string) => void;
  resetCV: () => void;
  versions: CVVersion[];
  activeVersion: CVVersion;
  onCreateVersion: (name: string) => void;
  onDuplicateVersion: (versionId: string, newName?: string) => void;
  onRenameVersion: (versionId: string, newName: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onSwitchVersion: (versionId: string) => void;
  defaultFileName: string;
}

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);

export function MobileLayout({
  cvData,
  template,
  setTemplate,
  sectionOrder,
  setSectionOrder,
  targetRole,
  setTargetRole,
  setCvData,
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
  versions,
  activeVersion,
  onCreateVersion,
  onDuplicateVersion,
  onRenameVersion,
  onDeleteVersion,
  onSwitchVersion,
  defaultFileName,
}: MobileLayoutProps) {
  const [currentStep, setCurrentStep] = useState<MobileWizardStepId>('profile');
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showVersionsPanel, setShowVersionsPanel] = useState(false);
  const mobilePrintElementId = 'cv-preview-mobile-print-source';

  const currentStepIndex = MOBILE_STEPS.findIndex((step) => step.id === currentStep);
  const currentStepConfig = MOBILE_STEPS[currentStepIndex];

  const profileComplete = useMemo(() => {
    return (
      hasText(cvData.personalInfo.firstName) &&
      hasText(cvData.personalInfo.lastName) &&
      hasText(cvData.personalInfo.email)
    );
  }, [cvData.personalInfo.firstName, cvData.personalInfo.lastName, cvData.personalInfo.email]);

  const hasExperience = useMemo(() => {
    return cvData.experiences.some((exp) => hasText(exp.company) || hasText(exp.position) || hasText(exp.description));
  }, [cvData.experiences]);

  const hasEducation = useMemo(() => {
    return cvData.education.some((edu) => hasText(edu.school) || hasText(edu.degree) || hasText(edu.field));
  }, [cvData.education]);

  const hasSkills = useMemo(() => {
    return cvData.skills.some((skill) => hasText(skill.name));
  }, [cvData.skills]);

  const hasLanguages = useMemo(() => {
    return cvData.languages.some((language) => hasText(language.name));
  }, [cvData.languages]);

  const hasSkillOrLanguage = hasSkills || hasLanguages;

  const readinessChecks = [profileComplete, hasExperience, hasEducation || hasSkillOrLanguage, Boolean(template)];
  const readinessProgress = Math.round(
    (readinessChecks.filter(Boolean).length / readinessChecks.length) * 100
  );
  const workflowProgress = Math.round(((currentStepIndex + 1) / MOBILE_STEPS.length) * 100);

  const checklistByStep: Record<MobileWizardStepId, StepChecklistItem[]> = {
    profile: [
      { label: 'Prénom renseigné', done: hasText(cvData.personalInfo.firstName), required: true },
      { label: 'Nom renseigné', done: hasText(cvData.personalInfo.lastName), required: true },
      { label: 'Email renseigné', done: hasText(cvData.personalInfo.email), required: true },
      { label: 'Titre professionnel (recommandé)', done: hasText(cvData.personalInfo.title) },
    ],
    experience: [
      { label: 'Au moins une expérience ajoutée', done: cvData.experiences.length > 0 },
      { label: 'Entreprise ou poste renseigné', done: hasExperience },
    ],
    details: [
      { label: 'Au moins une formation renseignée', done: hasEducation },
      { label: 'Au moins une compétence ou langue renseignée', done: hasSkillOrLanguage },
    ],
    style: [
      { label: 'Template sélectionné', done: Boolean(template) },
      { label: 'Ordre des sections personnalisé (optionnel)', done: sectionOrder.length > 0 },
    ],
    preview: [
      { label: 'Profil minimal complété', done: profileComplete, required: true },
      { label: 'Une expérience renseignée', done: hasExperience },
      { label: 'Formation ou compétences renseignées', done: hasEducation || hasSkillOrLanguage },
    ],
  };

  const stepCompletion: Record<MobileWizardStepId, boolean> = {
    profile: profileComplete,
    experience: hasExperience,
    details: hasEducation || hasSkillOrLanguage,
    style: Boolean(template),
    preview: readinessProgress >= 75,
  };

  const canGoNext = currentStep !== 'profile' || profileComplete;

  const navigateToStep = (stepId: MobileWizardStepId, stepIndex: number) => {
    if (stepIndex > 0 && !profileComplete) {
      toast.error('Complète prénom, nom et email avant de continuer.');
      return;
    }
    setCurrentStep(stepId);
  };

  const goToNextStep = () => {
    if (!canGoNext) {
      toast.error('Prénom, nom et email sont requis pour avancer.');
      return;
    }

    const nextStep = MOBILE_STEPS[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  };

  const goToPreviousStep = () => {
    const previousStep = MOBILE_STEPS[currentStepIndex - 1];
    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      resetCV();
      setCurrentStep('profile');
      toast.info('Données réinitialisées');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'profile':
        return <PersonalInfoForm data={cvData.personalInfo} onChange={updatePersonalInfo} />;

      case 'experience':
        return (
          <ExperienceForm
            experiences={cvData.experiences}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        );

      case 'details':
        return (
          <div className="space-y-4">
            <EducationForm
              education={cvData.education}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onRemove={removeEducation}
            />
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
          </div>
        );

      case 'style':
        return (
          <div className="space-y-4">
            <TemplateSelector selected={template} onChange={setTemplate} />
            <LayoutOrganizer
              cvData={cvData}
              onCvDataChange={setCvData}
              sectionOrder={sectionOrder}
              onSectionOrderChange={setSectionOrder}
              targetRole={targetRole}
              onTargetRoleChange={setTargetRole}
            />
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="form-section space-y-4 animate-fade-up">
              <h3 className="cv-section-title">Aperçu et export</h3>
              <p className="text-sm text-muted-foreground">
                Vérifie ton CV en plein écran avant export. Tu peux ensuite utiliser l’impression PDF ou les autres formats.
              </p>

              <div className="grid grid-cols-1 gap-2">
                <Button onClick={() => setShowPreview(true)} className="w-full" size="lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Ouvrir l&apos;aperçu
                </Button>
                <Button variant="outline" onClick={() => setShowExport(true)} className="w-full" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Ouvrir l&apos;export
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTemplateForPrint = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'classic':
        return <ClassicTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'creative':
        return <CreativeTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'executive':
        return <ExecutiveTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'minimalist':
        return <MinimalistTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'professional':
        return <ProfessionalTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'corporate':
        return <CorporateTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'elegant':
        return <ElegantTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'ats':
        return <ATSTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'swiss':
        return <SwissGridTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'editorial':
        return <EditorialTemplate data={cvData} sectionOrder={sectionOrder} />;
      case 'techmono':
        return <TechMonoTemplate data={cvData} sectionOrder={sectionOrder} />;
      default:
        return <ModernTemplate data={cvData} sectionOrder={sectionOrder} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">CV Pro</h1>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{activeVersion.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVersionsPanel((prev) => !prev)}
              className="h-8 px-2"
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              <span className="text-xs">Versions</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="container pb-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Étape {currentStepIndex + 1}/{MOBILE_STEPS.length}</span>
            <span>CV prêt: {readinessProgress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${workflowProgress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="container py-4 pb-24 space-y-4">
        {showVersionsPanel ? (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setShowVersionsPanel(false)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour au parcours
            </Button>
            <MobileVersionsPanel
              versions={versions}
              activeVersion={activeVersion}
              onCreateVersion={onCreateVersion}
              onDuplicateVersion={onDuplicateVersion}
              onRenameVersion={onRenameVersion}
              onDeleteVersion={onDeleteVersion}
              onSwitchVersion={onSwitchVersion}
            />
          </div>
        ) : (
          <>
            <section className="rounded-xl border border-border bg-card p-3 space-y-3">
              <div>
                <p className="text-sm font-semibold">{currentStepConfig.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{currentStepConfig.description}</p>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {MOBILE_STEPS.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = stepCompletion[step.id];
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => navigateToStep(step.id, index)}
                      className={cn(
                        'rounded-md border px-1.5 py-2 text-center transition-colors',
                        isActive ? 'border-primary bg-primary/10' : 'border-border bg-background',
                        !isActive && isCompleted && 'border-green-500/40 bg-green-500/5'
                      )}
                    >
                      <div className="flex justify-center mb-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                        )}
                      </div>
                      <span className={cn('text-[10px] leading-tight', isActive ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-3">
              <p className="text-sm font-medium">Checklist</p>
              <div className="mt-2 space-y-2">
                {checklistByStep[currentStep].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn(item.done ? 'text-foreground' : 'text-muted-foreground')}>
                      {item.label}
                    </span>
                    {item.required && (
                      <span className="text-[10px] text-primary font-semibold">Requis</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {renderStepContent()}
          </>
        )}
      </main>

      {!showVersionsPanel && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
          <div className="container py-3 flex items-center gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className="min-w-[110px]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>

            {currentStepIndex < MOBILE_STEPS.length - 1 ? (
              <Button onClick={goToNextStep} disabled={!canGoNext} className="flex-1">
                {currentStep === 'profile' && !profileComplete ? 'Compléter le profil' : 'Suivant'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={() => setShowPreview(true)} className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                Aperçu final
              </Button>
            )}
          </div>
        </footer>
      )}

      <FullScreenPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cvData={cvData}
        template={template}
        sectionOrder={sectionOrder}
        onExport={() => setShowExport(true)}
      />

      {/* Source d'impression mobile toujours disponible pour ExportDialog */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-100000px',
          top: 0,
          width: '210mm',
          minHeight: '297mm',
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div id={mobilePrintElementId} style={{ width: '210mm', minHeight: '297mm' }}>
          {renderTemplateForPrint()}
        </div>
      </div>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        cvData={cvData}
        template={template}
        visualElementId={mobilePrintElementId}
        defaultFilename={defaultFileName}
      />
    </div>
  );
}
