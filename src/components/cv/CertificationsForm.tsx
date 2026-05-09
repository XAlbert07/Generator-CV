import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Certification } from '@/types/cv';
import { Award, Plus, Trash2, ExternalLink } from 'lucide-react';

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: () => void;
  onUpdate: (id: string, data: Partial<Certification>) => void;
  onRemove: (id: string) => void;
}

export function CertificationsForm({ certifications, onAdd, onUpdate, onRemove }: CertificationsFormProps) {
  return (
    <div className="form-section space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="cv-section-title flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Certifications
        </h3>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {certifications.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Aucune certification ajoutée. Idéal pour IT, santé, droit.
        </p>
      )}

      {certifications.map((cert, index) => (
        <div key={cert.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Certification {index + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(cert.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom de la certification</Label>
              <Input
                placeholder="Ex: AWS Solutions Architect"
                value={cert.name}
                onChange={(e) => onUpdate(cert.id, { name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Organisme</Label>
              <Input
                placeholder="Ex: Amazon Web Services"
                value={cert.issuer}
                onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date d'obtention</Label>
              <Input
                type="month"
                value={cert.date}
                onChange={(e) => onUpdate(cert.id, { date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Lien vérification (optionnel)
              </Label>
              <Input
                placeholder="https://..."
                value={cert.url || ''}
                onChange={(e) => onUpdate(cert.id, { url: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
