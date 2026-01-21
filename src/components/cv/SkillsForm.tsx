import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
            <div key={skill.id} className="flex items-center gap-3">
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
