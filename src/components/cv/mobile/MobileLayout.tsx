import { useState } from 'react';
import { CVData, CVTemplate, type CVSectionId } from '@/types/cv';
import { CVVersion } from '@/types/cv';
import { PersonalInfoForm } from '@/components/cv/PersonalInfoForm';
import { ExperienceForm } from '@/components/cv/ExperienceForm';
import { EducationForm } from '@/components/cv/EducationForm';
import { SkillsForm } from '@/components/cv/SkillsForm';
import { TemplateSelector } from '@/components/cv/TemplateSelector';
import { LayoutOrganizer } from '@/components/cv/LayoutOrganizer';
import { BottomNavigation } from '@/components/cv/mobile/BottomNavigation';
import { FullScreenPreview } from '@/components/cv/mobile/FullScreenPreview';
import { FloatingPreviewButton } from '@/components/cv/mobile/FloatingPreviewButton';
import { ProgressBar } from '@/components/cv/mobile/ProgressBar';
import { MobileVersionsPanel } from '@/components/cv/mobile/MobileVersionsPanel';
import { ExportDialog } from '@/components/cv/export/ExportDialog';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type MobileSection = 'versions' | 'template' | 'personal' | 'experience' | 'education' | 'skills';

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
  // Nouvelles props pour la gestion de versions
  versions: CVVersion[];
  activeVersion: CVVersion;
  onCreateVersion: (name: string) => void;
  onDuplicateVersion: (versionId: string, newName?: string) => void;
  onRenameVersion: (versionId: string, newName: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onSwitchVersion: (versionId: string) => void;
  defaultFileName: string;
}

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
  const [activeSection, setActiveSection] = useState<MobileSection>('versions');
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate completion progress
  const calculateProgress = (): number => {
    let completed = 0;
    let total = 5;

    // Template selected
    if (template) completed++;
    
    // Personal info (check key fields)
    if (cvData.personalInfo.firstName && cvData.personalInfo.lastName && cvData.personalInfo.email) {
      completed++;
    }
    
    // At least one experience
    if (cvData.experiences.length > 0 && cvData.experiences[0].company) {
      completed++;
    }
    
    // At least one education
    if (cvData.education.length > 0 && cvData.education[0].school) {
      completed++;
    }
    
    // At least one skill
    if (cvData.skills.length > 0 || cvData.languages.length > 0) {
      completed++;
    }

    return Math.round((completed / total) * 100);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById('cv-preview-mobile');
      if (!element) throw new Error('Preview not found');

      element.style.transform = 'scale(1)';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}`.replace(/\s+/g, '_') || 'Mon_CV';
      pdf.save(`${fileName}.pdf`);

      element.style.transform = '';
      
      toast.success('CV téléchargé avec succès !');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      resetCV();
      setActiveSection('template');
      toast.info('Données réinitialisées');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'versions':
        return (
          <MobileVersionsPanel
            versions={versions}
            activeVersion={activeVersion}
            onCreateVersion={onCreateVersion}
            onDuplicateVersion={onDuplicateVersion}
            onRenameVersion={onRenameVersion}
            onDeleteVersion={onDeleteVersion}
            onSwitchVersion={onSwitchVersion}
          />
        );
      
      case 'template':
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
      
      case 'personal':
        return (
          <PersonalInfoForm
            data={cvData.personalInfo}
            onChange={updatePersonalInfo}
          />
        );
      
      case 'experience':
        return (
          <ExperienceForm
            experiences={cvData.experiences}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        );
      
      case 'education':
        return (
          <EducationForm
            education={cvData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        );
      
      case 'skills':
        return (
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
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">CV Pro</h1>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {activeVersion.name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <ProgressBar progress={calculateProgress()} />
      </header>

      {/* Main Content */}
      <main className="container py-4 space-y-4">
        {renderSection()}
      </main>

      {/* Floating Preview Button */}
      <FloatingPreviewButton onClick={() => setShowPreview(true)} />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        completedSections={{
          template: !!template,
          personal: !!(cvData.personalInfo.firstName && cvData.personalInfo.lastName),
          experience: cvData.experiences.length > 0,
          education: cvData.education.length > 0,
          skills: cvData.skills.length > 0 || cvData.languages.length > 0,
        }}
      />

      {/* Full Screen Preview Modal */}
      <FullScreenPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cvData={cvData}
        template={template}
        sectionOrder={sectionOrder}
        onExport={() => setShowExport(true)}
      />

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        cvData={cvData}
        visualElementId="cv-preview-mobile"
        defaultFilename={defaultFileName}
      />
    </div>
  );
}