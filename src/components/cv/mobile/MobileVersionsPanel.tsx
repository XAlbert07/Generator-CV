import { useState } from 'react';
import { CVVersion } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Copy, Pencil, Trash2, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MobileVersionsPanelProps {
  versions: CVVersion[];
  activeVersion: CVVersion;
  onCreateVersion: (name: string) => void;
  onDuplicateVersion: (versionId: string, newName?: string) => void;
  onRenameVersion: (versionId: string, newName: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onSwitchVersion: (versionId: string) => void;
}

export function MobileVersionsPanel({
  versions,
  activeVersion,
  onCreateVersion,
  onDuplicateVersion,
  onRenameVersion,
  onDeleteVersion,
  onSwitchVersion,
}: MobileVersionsPanelProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [renameVersionId, setRenameVersionId] = useState<string>('');
  const [renameValue, setRenameValue] = useState('');

  const handleCreateVersion = () => {
    if (!newVersionName.trim()) {
      toast.error('Veuillez entrer un nom');
      return;
    }
    onCreateVersion(newVersionName.trim());
    setNewVersionName('');
    setShowNewDialog(false);
    toast.success('Nouvelle version créée');
  };

  const handleDuplicate = (versionId: string, versionName: string) => {
    onDuplicateVersion(versionId, `${versionName} (copie)`);
    toast.success('Version dupliquée');
  };

  const handleRename = () => {
    if (!renameValue.trim()) {
      toast.error('Veuillez entrer un nom');
      return;
    }
    onRenameVersion(renameVersionId, renameValue.trim());
    setShowRenameDialog(false);
    setRenameVersionId('');
    setRenameValue('');
    toast.success('Version renommée');
  };

  const handleDelete = (versionId: string, versionName: string) => {
    if (confirm(`Supprimer "${versionName}" ?`)) {
      onDeleteVersion(versionId);
      toast.info('Version supprimée');
    }
  };

  const openRenameDialog = (versionId: string, currentName: string) => {
    setRenameVersionId(versionId);
    setRenameValue(currentName);
    setShowRenameDialog(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>Mes Versions de CV</CardTitle>
            <CardDescription>
              Gérez plusieurs versions de votre CV pour différentes candidatures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowNewDialog(true)} 
              className="w-full"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer une nouvelle version
            </Button>
          </CardContent>
        </Card>

        {/* Liste des versions */}
        <div className="space-y-3">
          {versions.map((version) => {
            const isActive = version.id === activeVersion?.id;
            
            return (
              <Card 
                key={version.id}
                className={cn(
                  'transition-all',
                  isActive && 'ring-2 ring-primary shadow-md'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox/Check icon */}
                    <div 
                      onClick={() => !isActive && onSwitchVersion(version.id)}
                      className="pt-1 cursor-pointer"
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                        isActive 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground/30'
                      )}>
                        {isActive && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    {/* Version info */}
                    <div 
                      onClick={() => !isActive && onSwitchVersion(version.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={cn(
                            'font-semibold',
                            isActive && 'text-primary'
                          )}>
                            {version.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Modifié le {new Date(version.updatedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Template: <span className="font-medium capitalize">{version.template}</span>
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(version.id, version.name)}
                      className="w-full min-w-0"
                    >
                      <Copy className="w-4 h-4 mr-1 shrink-0" />
                      <span className="truncate">Dupliquer</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRenameDialog(version.id, version.name)}
                      className="w-full min-w-0"
                    >
                      <Pencil className="w-4 h-4 mr-1 shrink-0" />
                      <span className="truncate">Renommer</span>
                    </Button>
                    {versions.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(version.id, version.name)}
                        className="col-span-2 w-full min-w-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4 mr-1 shrink-0" />
                        <span className="truncate">Supprimer</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog: Nouvelle version */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="version-name">Nom de la version</Label>
              <Input
                id="version-name"
                placeholder="Ex: CV Développeur Senior"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateVersion()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateVersion}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Renommer */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer la version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-input">Nouveau nom</Label>
              <Input
                id="rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRename}>
              Renommer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}