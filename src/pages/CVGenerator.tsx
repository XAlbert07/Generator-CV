import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useCVData } from '@/hooks/useCVData';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLayout } from '@/components/cv/mobile/MobileLayout';
import { PersonalInfoForm } from '@/components/cv/PersonalInfoForm';
import { ExperienceForm } from '@/components/cv/ExperienceForm';
import { EducationForm } from '@/components/cv/EducationForm';
import { SkillsForm } from '@/components/cv/SkillsForm';
import { TemplateSelector } from '@/components/cv/TemplateSelector';
import { CVPreview } from '@/components/cv/CVPreview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, FileText, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CVGenerator() {
  const {
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
  } = useCVData();

  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById('cv-preview');
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
      toast.info('Données réinitialisées');
    }
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <MobileLayout
        cvData={cvData}
        template={template}
        setTemplate={setTemplate}
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
      />
    );
  }

  // Desktop Layout (original)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">CV Pro</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showPreview ? 'Formulaire' : 'Aperçu'}
            </Button>
            <Button onClick={handleExportPDF} disabled={isExporting} size="sm">
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              Télécharger PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className={`flex-1 space-y-4 ${showPreview ? 'hidden lg:block' : ''}`}>
            <TemplateSelector selected={template} onChange={setTemplate} />
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="personal" className="text-xs sm:text-sm">Profil</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs sm:text-sm">Expérience</TabsTrigger>
                <TabsTrigger value="education" className="text-xs sm:text-sm">Formation</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs sm:text-sm">Compétences</TabsTrigger>
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
            </Tabs>
          </div>

          {/* Preview Section */}
          <div
            ref={previewRef}
            className={`lg:w-1/2 xl:w-2/5 ${!showPreview && 'hidden lg:block'}`}
          >
            <div className="sticky top-20">
              <div className="bg-muted/50 rounded-xl p-4 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
                <CVPreview data={cvData} template={template} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}