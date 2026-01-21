import { CVData, CVTemplate } from '@/types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';

interface CVPreviewProps {
  data: CVData;
  template: CVTemplate;
}

export function CVPreview({ data, template }: CVPreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'corporate':
        return <CorporateTemplate data={data} />;
      case 'elegant':
        return <ElegantTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

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
        {renderTemplate()}
      </div>
    </div>
  );
}
