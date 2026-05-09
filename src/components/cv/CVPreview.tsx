import React, { Suspense } from 'react';
import { CVData, CVTemplate, type CVSectionId } from '@/types/cv';
import { getTemplateComponent } from '@/lib/templateRegistry';

interface CVPreviewProps {
  data: CVData;
  template: CVTemplate;
  sectionOrder?: CVSectionId[];
}

export function CVPreview({ data, template, sectionOrder }: CVPreviewProps) {
  const Template = getTemplateComponent(template);

  return (
    <div className="preview-container h-full overflow-auto">
      <div
        id="cv-preview"
        className="origin-top-left"
        style={{
          width: '210mm',
          minHeight: '297mm',
          transform: 'scale(var(--preview-scale, 0.5))',
          transformOrigin: 'top left',
        }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[297mm] bg-white">
            <div className="text-gray-400 text-sm animate-pulse">Chargement du template...</div>
          </div>
        }>
          <Template data={data} sectionOrder={sectionOrder} />
        </Suspense>
      </div>
    </div>
  );
}
