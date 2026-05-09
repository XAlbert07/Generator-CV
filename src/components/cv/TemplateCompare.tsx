import React, { Suspense, useState } from 'react';
import { CVData, CVTemplate, type CVSectionId } from '@/types/cv';
import { getTemplateComponent } from '@/lib/templateRegistry';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const TEMPLATE_LIST: { id: CVTemplate; name: string }[] = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'creative', name: 'Créatif' },
  { id: 'executive', name: 'Exécutif' },
  { id: 'minimalist', name: 'Minimaliste' },
  { id: 'professional', name: 'Professionnel' },
  { id: 'corporate', name: 'Corporate' },
  { id: 'elegant', name: 'Élégant' },
  { id: 'ats', name: 'ATS' },
  { id: 'swiss', name: 'Swiss Grid' },
  { id: 'editorial', name: 'Éditorial' },
  { id: 'techmono', name: 'Tech Mono' },
  { id: 'medical', name: 'Médical' },
  { id: 'legal', name: 'Juridique' },
  { id: 'teacher', name: 'Enseignant' },
  { id: 'commerce', name: 'Commerce' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'student', name: 'Étudiant' },
  { id: 'infographic', name: 'Infographic' },
  { id: 'prestige', name: 'Noir Prestige' },
  { id: 'academic', name: 'Académique' },
  { id: 'nordic', name: 'Nordique' },
];

interface TemplateCompareProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  currentTemplate: CVTemplate;
  sectionOrder?: CVSectionId[];
  onSelectTemplate: (template: CVTemplate) => void;
}

function TemplateCard({
  templateId,
  data,
  sectionOrder,
  onNav,
}: {
  templateId: CVTemplate;
  data: CVData;
  sectionOrder?: CVSectionId[];
  onNav: (dir: -1 | 1) => void;
}) {
  const Template = getTemplateComponent(templateId);
  const info = TEMPLATE_LIST.find((t) => t.id === templateId);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Selector bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-border/50">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onNav(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-semibold truncate px-2">{info?.name || templateId}</span>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onNav(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-muted/20 to-muted/40 flex items-start justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl"
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: 'scale(0.42)',
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

export function TemplateCompare({
  isOpen,
  onClose,
  data,
  currentTemplate,
  sectionOrder,
  onSelectTemplate,
}: TemplateCompareProps) {
  const currentIdx = TEMPLATE_LIST.findIndex((t) => t.id === currentTemplate);
  const [leftIdx, setLeftIdx] = useState(currentIdx >= 0 ? currentIdx : 0);
  const [rightIdx, setRightIdx] = useState((currentIdx + 1) % TEMPLATE_LIST.length);

  const navigate = (side: 'left' | 'right', dir: -1 | 1) => {
    const setter = side === 'left' ? setLeftIdx : setRightIdx;
    setter((prev) => {
      const next = prev + dir;
      if (next < 0) return TEMPLATE_LIST.length - 1;
      if (next >= TEMPLATE_LIST.length) return 0;
      return next;
    });
  };

  if (!isOpen) return null;

  const leftTemplate = TEMPLATE_LIST[leftIdx];
  const rightTemplate = TEMPLATE_LIST[rightIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-md border-b border-border/50">
        <div>
          <h2 className="text-sm font-bold">Comparer les templates</h2>
          <p className="text-xs text-muted-foreground">
            Naviguez avec ◀ ▶ puis choisissez
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onSelectTemplate(leftTemplate.id);
              onClose();
            }}
          >
            Choisir « {leftTemplate.name} »
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onSelectTemplate(rightTemplate.id);
              onClose();
            }}
          >
            Choisir « {rightTemplate.name} »
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 flex min-h-0">
        <TemplateCard
          templateId={leftTemplate.id}
          data={data}
          sectionOrder={sectionOrder}
          onNav={(dir) => navigate('left', dir)}
        />
        <div className="w-px bg-border" />
        <TemplateCard
          templateId={rightTemplate.id}
          data={data}
          sectionOrder={sectionOrder}
          onNav={(dir) => navigate('right', dir)}
        />
      </div>
    </div>
  );
}
