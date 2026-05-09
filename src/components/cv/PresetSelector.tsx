import { useState } from 'react';
import { SMART_PRESETS, SmartPreset } from '@/lib/smartPresets';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, SkipForward } from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: SmartPreset) => void;
  onSkip: () => void;
}

export function PresetSelector({ onSelect, onSkip }: PresetSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6 animate-fade-up">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Assistant intelligent
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pour quel type de poste créez-vous votre CV ?
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Nous adapterons le template, les sections et les exemples à votre secteur.
          </p>
        </div>

        {/* Presets grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SMART_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              onMouseEnter={() => setHoveredId(preset.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card text-left transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:bg-primary/[0.02]"
            >
              <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                {preset.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {preset.label}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {preset.description}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 text-muted-foreground/0 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                style={{
                  opacity: hoveredId === preset.id ? 1 : 0,
                }}
              />
            </button>
          ))}
        </div>

        {/* Skip button */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Passer cette étape
          </Button>
        </div>
      </div>
    </div>
  );
}
