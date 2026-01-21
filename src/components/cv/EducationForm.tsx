import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Education } from '@/types/cv';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

export function EducationForm({ education, onAdd, onUpdate, onRemove }: EducationFormProps) {
  return (
    <div className="form-section space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="cv-section-title flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Formation
        </h3>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {education.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer.
        </p>
      )}

      {education.map((edu, index) => (
        <div key={edu.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Formation {index + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(edu.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Établissement</Label>
            <Input
              placeholder="Nom de l'école ou université"
              value={edu.school}
              onChange={(e) => onUpdate(edu.id, { school: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Diplôme</Label>
              <Input
                placeholder="Ex: Master, Licence..."
                value={edu.degree}
                onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Domaine</Label>
              <Input
                placeholder="Ex: Informatique, Marketing..."
                value={edu.field}
                onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optionnel)</Label>
            <Textarea
              placeholder="Mentions, spécialisations, projets..."
              value={edu.description}
              onChange={(e) => onUpdate(edu.id, { description: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
