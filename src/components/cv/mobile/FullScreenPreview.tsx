import { useEffect } from 'react';
import { CVData, CVTemplate, type CVSectionId } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { X, Download, Share2 } from 'lucide-react';
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

interface FullScreenPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  template: CVTemplate;
  sectionOrder?: CVSectionId[];
  onExport: () => void;
}

export function FullScreenPreview({
  isOpen,
  onClose,
  cvData,
  template,
  sectionOrder,
  onExport,
}: FullScreenPreviewProps) {
  // Render the correct template
  const renderTemplate = () => {
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Calculate and set the scale dynamically
      const updateScale = () => {
        const viewportWidth = window.innerWidth - 16; // padding
        const a4WidthMm = 210;
        const mmToPx = 3.7795275591; // 96 DPI
        const a4WidthPx = a4WidthMm * mmToPx;
        const scale = viewportWidth / a4WidthPx;
        
        document.documentElement.style.setProperty('--mobile-scale', scale.toString());
      };
      
      updateScale();
      window.addEventListener('resize', updateScale);
      
      return () => {
        window.removeEventListener('resize', updateScale);
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle swipe down to close
  useEffect(() => {
    if (!isOpen) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchEndY - touchStartY;
      
      if (swipeDistance > 100) {
        onClose();
      }
    };

    const previewElement = document.getElementById('mobile-preview-container');
    if (previewElement) {
      previewElement.addEventListener('touchstart', handleTouchStart);
      previewElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (previewElement) {
        previewElement.removeEventListener('touchstart', handleTouchStart);
        previewElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            <X className="w-5 h-5 mr-1" />
            Retour
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Mon CV',
                    text: 'Découvrez mon CV professionnel',
                  }).catch(() => {});
                }
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={onExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
        
        {/* Swipe indicator */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
      </header>

      {/* Preview Content */}
      <div
        id="mobile-preview-container"
        className="h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden bg-gradient-to-b from-muted/20 to-muted/40"
      >
        <div className="min-h-full flex items-start justify-center py-4 px-2">
          <div 
            className="bg-white rounded-lg shadow-2xl"
            style={{
              width: 'calc(100vw - 16px)',
              maxWidth: '100%',
              aspectRatio: '210 / 297',
            }}
          >
            <div
              id="cv-preview-mobile"
              className="w-full h-full overflow-hidden rounded-lg"
              style={{
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '210mm',
                  height: '297mm',
                  transform: 'scale(var(--mobile-scale))',
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
