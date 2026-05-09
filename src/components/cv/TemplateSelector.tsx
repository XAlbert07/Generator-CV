import { CVTemplate } from '@/types/cv';
import { cn } from '@/lib/utils';
import { Palette, Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: CVTemplate;
  onChange: (template: CVTemplate) => void;
}

/**
 * Each template has a mini schematic layout that visually represents
 * the actual template structure (header position, sidebar, column layout).
 */
type TemplateLayout = 'top-header' | 'centered-header' | 'sidebar-left' | 'sidebar-right' | 'split' | 'minimal';

interface TemplateInfo {
  id: CVTemplate;
  name: string;
  description: string;
  headerColor: string;
  accentColor: string;
  layout: TemplateLayout;
  tag?: string;
}

const templates: TemplateInfo[] = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Clean et professionnel',
    headerColor: '#2563eb',
    accentColor: '#3b82f6',
    layout: 'top-header',
    tag: 'Populaire',
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Élégant et intemporel',
    headerColor: '#1f2937',
    accentColor: '#4b5563',
    layout: 'centered-header',
  },
  {
    id: 'creative',
    name: 'Créatif',
    description: 'Audacieux et unique',
    headerColor: '#0f172a',
    accentColor: '#f59e0b',
    layout: 'sidebar-left',
    tag: 'Design',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Pour profils de direction',
    headerColor: '#1e293b',
    accentColor: '#1e40af',
    layout: 'top-header',
    tag: 'Pro',
  },
  {
    id: 'minimalist',
    name: 'Minimaliste',
    description: 'Épuré et moderne',
    headerColor: '#18181b',
    accentColor: '#71717a',
    layout: 'minimal',
  },
  {
    id: 'professional',
    name: 'Professionnel',
    description: 'Classique et moderne',
    headerColor: '#1e293b',
    accentColor: '#3b82f6',
    layout: 'sidebar-left',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Traditionnel professionnel',
    headerColor: '#312e81',
    accentColor: '#4338ca',
    layout: 'top-header',
  },
  {
    id: 'elegant',
    name: 'Élégant',
    description: 'Sophistiqué et raffiné',
    headerColor: '#334155',
    accentColor: '#d97706',
    layout: 'sidebar-left',
  },
  {
    id: 'ats',
    name: 'ATS-Friendly',
    description: 'Optimisé recruteurs',
    headerColor: '#000000',
    accentColor: '#6b7280',
    layout: 'minimal',
  },
  {
    id: 'swiss',
    name: 'Swiss Grid',
    description: 'Grille structurée',
    headerColor: '#b91c1c',
    accentColor: '#18181b',
    layout: 'split',
    tag: 'Design',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Style magazine',
    headerColor: '#78716c',
    accentColor: '#d4a57a',
    layout: 'centered-header',
  },
  {
    id: 'techmono',
    name: 'Tech Mono',
    description: 'Style terminal',
    headerColor: '#18181b',
    accentColor: '#10b981',
    layout: 'sidebar-right',
  },
  // ── New templates ──
  {
    id: 'medical',
    name: 'Médical',
    description: 'Santé & Pharma',
    headerColor: '#0d9488',
    accentColor: '#14b8a6',
    layout: 'sidebar-right',
    tag: 'Santé',
  },
  {
    id: 'legal',
    name: 'Juridique',
    description: 'Droit & Notariat',
    headerColor: '#7f1d1d',
    accentColor: '#b8860b',
    layout: 'centered-header',
    tag: 'Droit',
  },
  {
    id: 'teacher',
    name: 'Enseignant',
    description: 'Éducation & Formation',
    headerColor: '#475569',
    accentColor: '#f59e0b',
    layout: 'split',
  },
  {
    id: 'commerce',
    name: 'Commerce',
    description: 'Vente & Retail',
    headerColor: '#1c1917',
    accentColor: '#ea580c',
    layout: 'top-header',
    tag: 'Vente',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    description: 'Indépendants',
    headerColor: '#7c3aed',
    accentColor: '#ec4899',
    layout: 'sidebar-left',
  },
  {
    id: 'student',
    name: 'Étudiant',
    description: 'Stages & 1er emploi',
    headerColor: '#0891b2',
    accentColor: '#22d3ee',
    layout: 'top-header',
    tag: 'Jeune',
  },
  {
    id: 'infographic',
    name: 'Infographic',
    description: 'Visuel & Data',
    headerColor: '#4f46e5',
    accentColor: '#06b6d4',
    layout: 'sidebar-left',
    tag: 'Visuel',
  },
  {
    id: 'prestige',
    name: 'Noir Prestige',
    description: 'Luxe & Premium',
    headerColor: '#09090b',
    accentColor: '#f59e0b',
    layout: 'sidebar-left',
    tag: 'Luxe',
  },
  {
    id: 'academic',
    name: 'Académique',
    description: 'Recherche & Doctorat',
    headerColor: '#14532d',
    accentColor: '#a3e635',
    layout: 'minimal',
  },
  {
    id: 'nordic',
    name: 'Nordique',
    description: 'Scandinave épuré',
    headerColor: '#1e293b',
    accentColor: '#bae6fd',
    layout: 'top-header',
  },
];

/** Mini thumbnail that schematically represents the template layout */
function TemplateThumbnail({ template, isSelected }: { template: TemplateInfo; isSelected: boolean }) {
  const { headerColor, accentColor, layout } = template;

  return (
    <div
      className={cn(
        'aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 relative',
        isSelected
          ? 'border-primary ring-2 ring-primary/25 shadow-md'
          : 'border-border/50 hover:border-border'
      )}
      style={{ background: '#fff' }}
    >
      {/* Selected check badge */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {layout === 'top-header' && (
        <>
          {/* Full-width header */}
          <div className="h-[28%] px-2.5 pt-2.5 pb-1.5 flex items-end" style={{ background: headerColor }}>
            <div>
              <div className="w-5 h-5 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.25)' }} />
              <div className="h-1 w-10 rounded-full mb-0.5" style={{ background: 'rgba(255,255,255,0.5)' }} />
              <div className="h-0.5 w-7 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>
          <div className="p-2.5 space-y-2">
            <div className="space-y-1">
              <div className="h-0.5 w-8" style={{ background: accentColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-4/5 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-10" style={{ background: accentColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-5/6 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-7" style={{ background: accentColor, borderRadius: 2 }} />
              <div className="flex gap-1 flex-wrap">
                <div className="h-2 w-6 bg-gray-100 rounded-sm" />
                <div className="h-2 w-8 bg-gray-100 rounded-sm" />
                <div className="h-2 w-5 bg-gray-100 rounded-sm" />
              </div>
            </div>
          </div>
        </>
      )}

      {layout === 'centered-header' && (
        <>
          {/* Centered name header */}
          <div className="h-[25%] px-2.5 pt-3 flex flex-col items-center justify-center border-b-2" style={{ borderColor: headerColor }}>
            <div className="h-1 w-14 rounded-full mb-1" style={{ background: headerColor }} />
            <div className="h-0.5 w-8 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
          </div>
          <div className="p-2.5 space-y-2">
            <div className="space-y-1">
              <div className="h-0.5 w-10 mx-auto" style={{ background: headerColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-4/5 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-12 mx-auto" style={{ background: headerColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-8 mx-auto" style={{ background: headerColor, borderRadius: 2 }} />
              <div className="h-[3px] w-5/6 bg-gray-100 rounded-sm" />
            </div>
          </div>
        </>
      )}

      {layout === 'sidebar-left' && (
        <div className="flex h-full">
          {/* Dark sidebar */}
          <div className="w-[35%] p-1.5 flex flex-col" style={{ background: headerColor }}>
            <div className="w-6 h-6 rounded-full mx-auto mb-1.5" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="h-0.5 w-8 mx-auto rounded-full mb-0.5" style={{ background: accentColor }} />
            <div className="h-0.5 w-6 mx-auto rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="space-y-1.5 mt-auto">
              <div className="h-0.5 w-full rounded-full" style={{ background: accentColor, opacity: 0.6 }} />
              <div className="h-[3px] w-full rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-[3px] w-4/5 rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-0.5 w-full rounded-full mt-1" style={{ background: accentColor, opacity: 0.6 }} />
              <div className="h-[3px] w-full rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-[3px] w-3/4 rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 p-2 space-y-1.5">
            <div className="space-y-1">
              <div className="h-0.5 w-8" style={{ background: accentColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-4/5 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-10" style={{ background: accentColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-5/6 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-7" style={{ background: accentColor, borderRadius: 2 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-2/3 bg-gray-100 rounded-sm" />
            </div>
          </div>
        </div>
      )}

      {layout === 'sidebar-right' && (
        <div className="flex h-full">
          {/* Main content */}
          <div className="flex-1 p-2 space-y-1.5">
            <div className="space-y-1">
              <div className="h-1 w-12 rounded-sm" style={{ background: accentColor }} />
              <div className="h-0.5 w-8 rounded-full" style={{ background: headerColor }} />
            </div>
            <div className="space-y-1 mt-2">
              <div className="h-0.5 w-8" style={{ background: accentColor, borderRadius: 2, opacity: 0.6 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-4/5 bg-gray-100 rounded-sm" />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-10" style={{ background: accentColor, borderRadius: 2, opacity: 0.6 }} />
              <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
              <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
            </div>
          </div>
          {/* Dark sidebar */}
          <div className="w-[30%] p-1.5 space-y-2" style={{ background: headerColor }}>
            <div className="space-y-1">
              <div className="h-0.5 w-full rounded-full" style={{ background: accentColor, opacity: 0.7 }} />
              <div className="h-[3px] w-full rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-[3px] w-3/4 rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div className="space-y-1">
              <div className="h-0.5 w-full rounded-full" style={{ background: accentColor, opacity: 0.7 }} />
              <div className="h-[3px] w-full rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-[3px] w-4/5 rounded-sm" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </div>
        </div>
      )}

      {layout === 'split' && (
        <>
          {/* Split header with accent bar */}
          <div className="flex h-[22%]">
            <div className="w-[30%]" style={{ background: headerColor }} />
            <div className="flex-1 p-2 flex items-center">
              <div>
                <div className="h-1 w-12 rounded-full mb-0.5" style={{ background: headerColor }} />
                <div className="h-0.5 w-8 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
              </div>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="w-[30%] p-1.5" style={{ background: `${headerColor}08` }}>
              <div className="space-y-1">
                <div className="h-0.5 w-full rounded-full" style={{ background: headerColor, opacity: 0.3 }} />
                <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
                <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
              </div>
            </div>
            <div className="flex-1 p-2 space-y-1.5">
              <div className="space-y-1">
                <div className="h-0.5 w-8" style={{ background: headerColor, borderRadius: 2 }} />
                <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
                <div className="h-[3px] w-4/5 bg-gray-100 rounded-sm" />
              </div>
              <div className="space-y-1">
                <div className="h-0.5 w-10" style={{ background: headerColor, borderRadius: 2 }} />
                <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
                <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
              </div>
            </div>
          </div>
        </>
      )}

      {layout === 'minimal' && (
        <div className="p-2.5 space-y-2 h-full">
          {/* Just name and lines, no color blocks */}
          <div className="pt-1">
            <div className="h-1.5 w-14 rounded-full mb-0.5" style={{ background: headerColor }} />
            <div className="h-0.5 w-10 rounded-full mb-2" style={{ background: accentColor, opacity: 0.4 }} />
            <div className="h-px w-full" style={{ background: headerColor, opacity: 0.2 }} />
          </div>
          <div className="space-y-1">
            <div className="h-0.5 w-8" style={{ background: headerColor, borderRadius: 2, opacity: 0.6 }} />
            <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
            <div className="h-[3px] w-4/5 bg-gray-100 rounded-sm" />
          </div>
          <div className="space-y-1">
            <div className="h-0.5 w-10" style={{ background: headerColor, borderRadius: 2, opacity: 0.6 }} />
            <div className="h-[3px] w-full bg-gray-100 rounded-sm" />
            <div className="h-[3px] w-3/4 bg-gray-100 rounded-sm" />
            <div className="h-[3px] w-5/6 bg-gray-100 rounded-sm" />
          </div>
          <div className="space-y-1">
            <div className="h-0.5 w-7" style={{ background: headerColor, borderRadius: 2, opacity: 0.6 }} />
            <div className="flex gap-1 flex-wrap">
              <div className="h-2 w-6 bg-gray-100 rounded-sm" />
              <div className="h-2 w-8 bg-gray-100 rounded-sm" />
              <div className="h-2 w-5 bg-gray-100 rounded-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="form-section space-y-4">
      <h3 className="cv-section-title flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        Style du CV
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            className="text-left transition-all group"
          >
            <TemplateThumbnail
              template={template}
              isSelected={selected === template.id}
            />
            <div className="mt-2 px-0.5">
              <p className={cn(
                'text-xs font-semibold leading-tight',
                selected === template.id ? 'text-primary' : 'text-foreground'
              )}>
                {template.name}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                {template.description}
              </p>
              {template.tag && (
                <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {template.tag}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
