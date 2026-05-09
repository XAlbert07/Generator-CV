import { useState, useRef } from 'react';
import { CVVersion } from '@/types/cv';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Upload, FileJson, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface DataManagerProps {
  versions: CVVersion[];
  onImport: (versions: CVVersion[]) => void;
}

export function DataManager({ versions, onImport }: DataManagerProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importPreview, setImportPreview] = useState<CVVersion[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const exportData = {
        _meta: {
          app: 'CV Pro Generator',
          version: '2.0',
          exportDate: new Date().toISOString(),
          count: versions.length,
        },
        versions,
      };
      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv-pro-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${versions.length} version(s) exportée(s)`);
    } catch {
      toast.error("Erreur lors de l'export");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Validate structure
        if (data.versions && Array.isArray(data.versions)) {
          setImportPreview(data.versions);
          setShowImportDialog(true);
        } else if (Array.isArray(data)) {
          // Direct array format
          setImportPreview(data);
          setShowImportDialog(true);
        } else {
          toast.error('Format de fichier invalide');
        }
      } catch {
        toast.error('Le fichier ne contient pas de JSON valide');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmImport = () => {
    if (!importPreview) return;
    onImport(importPreview);
    toast.success(`${importPreview.length} version(s) importée(s)`);
    setShowImportDialog(false);
    setImportPreview(null);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="text-muted-foreground h-8 px-2"
          title="Sauvegarder mes données (JSON)"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline ml-1 text-xs">Sauvegarder</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="text-muted-foreground h-8 px-2"
          title="Restaurer une sauvegarde (JSON)"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline ml-1 text-xs">Restaurer</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Import confirmation dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Importer des données
            </DialogTitle>
            <DialogDescription>
              Le fichier contient {importPreview?.length || 0} version(s) de CV.
            </DialogDescription>
          </DialogHeader>

          {importPreview && importPreview.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {importPreview.map((v, i) => (
                <div
                  key={v.id || i}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 text-sm"
                >
                  <span className="font-medium truncate">{v.name || `Version ${i + 1}`}</span>
                  <span className="text-xs text-muted-foreground">{v.template}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Cela <strong>remplacera toutes vos données actuelles</strong>. Exportez d'abord si vous souhaitez garder une copie.</p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmImport}>
              Importer {importPreview?.length || 0} version(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
