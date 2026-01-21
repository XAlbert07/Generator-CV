import { useState } from 'react';
import { CVVersion } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, Copy, Pencil, Trash2, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

interface VersionsManagerProps {
  versions: CVVersion[];
  activeVersion: CVVersion;
  onCreateVersion: (name: string) => void;
  onDuplicateVersion: (versionId: string, newName?: string) => void;
  onRenameVersion: (versionId: string, newName: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onSwitchVersion: (versionId: string) => void;
}

export function VersionsManager({
  versions,
  activeVersion,
  onCreateVersion,
  onDuplicateVersion,
  onRenameVersion,
  onDeleteVersion,
  onSwitchVersion,
}: VersionsManagerProps) {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="max-w-[150px] truncate">{activeVersion?.name || 'Mon CV'}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Mes versions ({versions.length})
          </div>
          <DropdownMenuSeparator />
          
          {/* Liste des versions */}
          {versions.map((version) => (
            <div key={version.id} className="group relative">
              <DropdownMenuItem
                onClick={() => onSwitchVersion(version.id)}
                className="pr-20"
              >
                <div className="flex items-center gap-2 flex-1">
                  {version.id === activeVersion?.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{version.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(version.updatedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
              
              {/* Actions (visible au hover) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(version.id, version.name);
                  }}
                  className="p-1 hover:bg-accent rounded"
                  title="Dupliquer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openRenameDialog(version.id, version.name);
                  }}
                  className="p-1 hover:bg-accent rounded"
                  title="Renommer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {versions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(version.id, version.name);
                    }}
                    className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <DropdownMenuSeparator />
          
          {/* Créer nouvelle version */}
          <DropdownMenuItem onClick={() => setShowNewDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle version
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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