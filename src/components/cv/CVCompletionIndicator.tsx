import { useMemo } from 'react';
import { CVData } from '@/types/cv';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface CVCompletionIndicatorProps {
  data: CVData;
  className?: string;
}

interface CompletionItem {
  label: string;
  weight: number;
  complete: boolean;
}

function computeCompletion(data: CVData): { percentage: number; items: CompletionItem[] } {
  const items: CompletionItem[] = [
    {
      label: 'Nom & Prénom',
      weight: 15,
      complete: !!(data.personalInfo.firstName && data.personalInfo.lastName),
    },
    {
      label: 'Titre professionnel',
      weight: 10,
      complete: !!data.personalInfo.title,
    },
    {
      label: 'Email',
      weight: 10,
      complete: !!data.personalInfo.email,
    },
    {
      label: 'Téléphone',
      weight: 5,
      complete: !!data.personalInfo.phone,
    },
    {
      label: 'Résumé / Profil',
      weight: 15,
      complete: !!(data.personalInfo.summary && data.personalInfo.summary.length >= 20),
    },
    {
      label: 'Photo',
      weight: 5,
      complete: !!data.personalInfo.photo,
    },
    {
      label: 'Au moins 1 expérience',
      weight: 15,
      complete: data.experiences.length > 0 && !!data.experiences[0]?.position,
    },
    {
      label: 'Au moins 1 formation',
      weight: 10,
      complete: data.education.length > 0 && !!data.education[0]?.degree,
    },
    {
      label: 'Au moins 2 compétences',
      weight: 10,
      complete: data.skills.filter((s) => !!s.name).length >= 2,
    },
    {
      label: 'Au moins 1 langue',
      weight: 5,
      complete: data.languages.length > 0 && !!data.languages[0]?.name,
    },
  ];

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const achieved = items.filter((i) => i.complete).reduce((sum, i) => sum + i.weight, 0);
  const percentage = Math.round((achieved / totalWeight) * 100);

  return { percentage, items };
}

function getColor(pct: number): string {
  if (pct >= 80) return '#10b981'; // emerald
  if (pct >= 50) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

function getLabel(pct: number): string {
  if (pct >= 90) return 'Excellent !';
  if (pct >= 70) return 'Bon CV';
  if (pct >= 50) return 'En progrès';
  return 'À compléter';
}

export function CVCompletionIndicator({ data, className = '' }: CVCompletionIndicatorProps) {
  const { percentage, items } = useMemo(() => computeCompletion(data), [data]);
  const color = getColor(percentage);
  const missing = items.filter((i) => !i.complete);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 cursor-default ${className}`}>
            {/* Circular progress */}
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted/30"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease-in-out, stroke 0.3s ease' }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
                style={{ color }}
              >
                {percentage}
              </span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {getLabel(percentage)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[260px]">
          <div className="space-y-1.5 text-xs">
            <p className="font-semibold" style={{ color }}>
              CV complété à {percentage}%
            </p>
            {missing.length > 0 && (
              <>
                <p className="text-muted-foreground">Pour améliorer :</p>
                {missing.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{item.label} <span className="text-[10px] text-muted-foreground/70">(+{item.weight}%)</span></span>
                  </div>
                ))}
              </>
            )}
            {missing.length === 0 && (
              <div className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Toutes les sections sont remplies !</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
