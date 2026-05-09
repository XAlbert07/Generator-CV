import React, { Suspense, useEffect, useState } from 'react';
import { CVData, CVTemplate, type CVSectionId } from '@/types/cv';
import { getTemplateComponent } from '@/lib/templateRegistry';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface DesktopFullPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  template: CVTemplate;
  sectionOrder?: CVSectionId[];
}

export function DesktopFullPreview({
  isOpen,
  onClose,
  data,
  template,
  sectionOrder,
}: DesktopFullPreviewProps) {
  const Template = getTemplateComponent(template);
  const [zoom, setZoom] = useState(0.75);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.1, 1.5));
        if (e.key === '-') setZoom((z) => Math.max(z - 0.1, 0.3));
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Aperçu plein écran
          </span>
          <span className="text-xs text-muted-foreground/60">
            (Esc pour fermer, +/- pour zoomer)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        <div
          className="bg-white rounded-lg shadow-2xl transition-transform duration-200"
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[297mm]">
                <div className="text-gray-400 text-sm animate-pulse">Chargement...</div>
              </div>
            }
          >
            <Template data={data} sectionOrder={sectionOrder} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
