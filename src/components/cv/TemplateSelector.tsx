import { CVTemplate } from '@/types/cv';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface TemplateSelectorProps {
  selected: CVTemplate;
  onChange: (template: CVTemplate) => void;
}

const templates: { id: CVTemplate; name: string; description: string; colors: string[] }[] = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Clean et professionnel',
    colors: ['bg-blue-600', 'bg-blue-700'],
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Élégant et intemporel',
    colors: ['bg-gray-800', 'bg-gray-600'],
  },
  {
    id: 'creative',
    name: 'Créatif',
    description: 'Audacieux et unique',
    colors: ['bg-indigo-600', 'bg-pink-600'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Pour profils de direction',
    colors: ['bg-navy-900', 'bg-blue-900'],
  },
  {
    id: 'minimalist',
    name: 'Minimaliste',
    description: 'Épuré et moderne',
    colors: ['bg-gray-900', 'bg-gray-700'],
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Classique et moderne',
    colors: ['bg-slate-800', 'bg-slate-700'],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Traditionnel professionnel',
    colors: ['bg-indigo-950', 'bg-indigo-900'],
  },
  {
    id: 'elegant',
    name: 'Élégant',
    description: 'Sophistiqué et raffiné',
    colors: ['bg-slate-700', 'bg-amber-600'],
  },
];

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="form-section space-y-4">
      <h3 className="cv-section-title flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        Style du CV
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className={cn(
              'template-card p-3 rounded-lg text-left transition-all',
              selected === template.id && 'active'
            )}
          >
            <div className="flex gap-1 mb-2">
              {template.colors.map((color, i) => (
                <div
                  key={i}
                  className={cn('w-4 h-4 rounded-full', color)}
                />
              ))}
            </div>
            <p className="text-sm font-medium">{template.name}</p>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
