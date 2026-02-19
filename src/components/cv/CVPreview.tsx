import { CVData, CVTemplate, type CVSectionId } from '@/types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { ATSTemplate } from './templates/ATSTemplate';
import { SwissGridTemplate } from './templates/SwissGridTemplate';
import { EditorialTemplate } from './templates/EditorialTemplate';
import { TechMonoTemplate } from './templates/TechMonoTemplate';
interface CVPreviewProps {
  data: CVData;
  template: CVTemplate;
  sectionOrder?: CVSectionId[];
}

export function CVPreview({ data, template, sectionOrder }: CVPreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} sectionOrder={sectionOrder} />;
      case 'classic':
        return <ClassicTemplate data={data} sectionOrder={sectionOrder} />;
      case 'creative':
        return <CreativeTemplate data={data} sectionOrder={sectionOrder} />;
      case 'executive':
        return <ExecutiveTemplate data={data} sectionOrder={sectionOrder} />;
      case 'minimalist':
        return <MinimalistTemplate data={data} sectionOrder={sectionOrder} />;
      case 'professional':
        return <ProfessionalTemplate data={data} sectionOrder={sectionOrder} />;
      case 'corporate':
        return <CorporateTemplate data={data} sectionOrder={sectionOrder} />;
      case 'elegant':
        return <ElegantTemplate data={data} sectionOrder={sectionOrder} />;
      case 'ats':
        return <ATSTemplate data={data} sectionOrder={sectionOrder} />;
      case 'swiss':
        return <SwissGridTemplate data={data} sectionOrder={sectionOrder} />;
      case 'editorial':
        return <EditorialTemplate data={data} sectionOrder={sectionOrder} />;
      case 'techmono':
        return <TechMonoTemplate data={data} sectionOrder={sectionOrder} />;
      default:
        return <ModernTemplate data={data} sectionOrder={sectionOrder} />;
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
