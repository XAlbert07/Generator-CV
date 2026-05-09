import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skill, Language } from '@/types/cv';
import { Wrench, Languages, Plus, Trash2 } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  languages: Language[];
  onAddSkill: () => void;
  onUpdateSkill: (id: string, data: Partial<Skill>) => void;
  onRemoveSkill: (id: string) => void;
  onAddLanguage: () => void;
  onUpdateLanguage: (id: string, data: Partial<Language>) => void;
  onRemoveLanguage: (id: string) => void;
}

const languageLevels = [
  'Débutant',
  'Élémentaire',
  'Intermédiaire',
  'Avancé',
  'Courant',
  'Natif',
];

const skillLevelLabels: Record<number, string> = {
  1: 'Débutant',
  2: 'Basique',
  3: 'Intermédiaire',
  4: 'Avancé',
  5: 'Expert',
};

export function SkillsForm({
  skills,
  languages,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
  onAddLanguage,
  onUpdateLanguage,
  onRemoveLanguage,
}: SkillsFormProps) {
  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <div className="form-section space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <h3 className="cv-section-title flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Compétences
          </h3>
          <Button variant="outline" size="sm" onClick={onAddSkill}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {skills.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">
            Aucune compétence ajoutée.
          </p>
        )}

        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Nom de la compétence"
                  value={skill.name}
                  onChange={(e) => onUpdateSkill(skill.id, { name: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveSkill(skill.id)}
                  className="text-destructive hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {/* Skill level slider */}
              <div className="flex items-center gap-3 px-1">
                <span className="text-xs text-muted-foreground w-12 shrink-0">Niveau</span>
                <Slider
                  value={[skill.level || 3]}
                  onValueChange={([value]) => onUpdateSkill(skill.id, { level: value })}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-medium text-primary w-24 text-right">
                  {skillLevelLabels[skill.level || 3]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages Section */}
      <div className="form-section space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <h3 className="cv-section-title flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary" />
            Langues
          </h3>
          <Button variant="outline" size="sm" onClick={onAddLanguage}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {languages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">
            Aucune langue ajoutée.
          </p>
        )}

        <div className="space-y-4">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-3">
              <Input
                placeholder="Ex: Français, Anglais..."
                value={lang.name}
                onChange={(e) => onUpdateLanguage(lang.id, { name: e.target.value })}
                className="flex-1"
              />
              <Select
                value={lang.level}
                onValueChange={(level) => onUpdateLanguage(lang.id, { level })}
              >
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveLanguage(lang.id)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
