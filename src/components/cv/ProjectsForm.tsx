import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/cv';
import { FolderKanban, Plus, Trash2, ExternalLink } from 'lucide-react';

interface ProjectsFormProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onRemove: (id: string) => void;
}

export function ProjectsForm({ projects, onAdd, onUpdate, onRemove }: ProjectsFormProps) {
  return (
    <div className="form-section space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="cv-section-title flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-primary" />
          Projets
        </h3>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {projects.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Aucun projet ajouté. Idéal pour stages, freelance et reconversion.
        </p>
      )}

      {projects.map((project, index) => (
        <div key={project.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Projet {index + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(project.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Nom du projet</Label>
            <Input
              placeholder="Ex: Application de gestion de stock"
              value={project.name}
              onChange={(e) => onUpdate(project.id, { name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Décrivez le projet, les technologies utilisées, les résultats..."
              value={project.description}
              onChange={(e) => onUpdate(project.id, { description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Lien (optionnel)
            </Label>
            <Input
              placeholder="https://github.com/..."
              value={project.url || ''}
              onChange={(e) => onUpdate(project.id, { url: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
