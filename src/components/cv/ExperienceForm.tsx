import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Experience } from '@/types/cv';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

interface ExperienceFormProps {
  experiences: Experience[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}

export function ExperienceForm({ experiences, onAdd, onUpdate, onRemove }: ExperienceFormProps) {
  return (
    <div className="form-section space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="cv-section-title flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Expériences professionnelles
        </h3>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {experiences.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.
        </p>
      )}

      {experiences.map((exp, index) => (
        <div key={exp.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Expérience {index + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(exp.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input
                placeholder="Nom de l'entreprise"
                value={exp.company}
                onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Poste</Label>
              <Input
                placeholder="Titre du poste"
                value={exp.position}
                onChange={(e) => onUpdate(exp.id, { position: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="month"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
              />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    onUpdate(exp.id, { current: !!checked, endDate: checked ? '' : exp.endDate })
                  }
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                  Poste actuel
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Décrivez vos responsabilités et réalisations..."
              value={exp.description}
              onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
