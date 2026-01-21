import * as React from "react";
import type { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";
import {
  exportAtsPdf,
  exportDocx,
  exportVisualPdfFromElementId,
  type ExportFormat,
  type ExportOptions,
} from "@/lib/export/cvExport";

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvData: CVData;
  /**
   * Element id to capture for “PDF visuel”.
   * Exemple: "cv-preview" (desktop) ou "cv-preview-mobile" (mobile)
   */
  visualElementId: string;
  defaultFilename: string;
};

const FONT_OPTIONS: { id: ExportOptions["fontFamily"]; label: string }[] = [
  { id: "sans", label: "Sans (Calibri/Helvetica)" },
  { id: "serif", label: "Serif (Times)" },
  { id: "mono", label: "Mono (Courier)" },
];

const FORMAT_OPTIONS: { id: ExportFormat; label: string; hint?: string }[] = [
  { id: "pdf_visual", label: "PDF (visuel)", hint: "Identique à l’aperçu (image)" },
  { id: "pdf_ats", label: "PDF ATS (texte)", hint: "Texte sélectionnable + liens cliquables" },
  { id: "docx", label: "DOCX", hint: "Éditable (Word) + liens cliquables" },
];

export function ExportDialog({ open, onOpenChange, cvData, visualElementId, defaultFilename }: ExportDialogProps) {
  const [format, setFormat] = React.useState<ExportFormat>("pdf_visual");
  const [filename, setFilename] = React.useState(defaultFilename);
  const [marginMm, setMarginMm] = React.useState<number>(10);
  const [fontFamily, setFontFamily] = React.useState<ExportOptions["fontFamily"]>("sans");
  const [fontSizePt, setFontSizePt] = React.useState<number>(11);
  const [rasterScale, setRasterScale] = React.useState<number>(2);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setFilename(defaultFilename);
  }, [open, defaultFilename]);

  const onExport = async () => {
    setIsExporting(true);
    const opts: ExportOptions = {
      format,
      filename,
      marginMm,
      fontFamily,
      fontSizePt,
      rasterScale,
    };

    try {
      if (format === "pdf_visual") {
        await exportVisualPdfFromElementId(visualElementId, opts);
      } else if (format === "pdf_ats") {
        exportAtsPdf(cvData, opts);
      } else if (format === "docx") {
        await exportDocx(cvData, opts);
      }
      toast.success("Export terminé");
      onOpenChange(false);
    } catch (e: any) {
      console.error("Export error:", e);
      toast.error(e?.message ? `Erreur export: ${e.message}` : "Erreur lors de l’export");
    } finally {
      setIsExporting(false);
    }
  };

  const formatHint = FORMAT_OPTIONS.find((f) => f.id === format)?.hint;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exporter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un format" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formatHint && <p className="text-xs text-muted-foreground">{formatHint}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="export-filename">Nom du fichier</Label>
            <Input
              id="export-filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Ex: CV_Jean_Dupont"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="export-margin">Marges (mm)</Label>
              <Input
                id="export-margin"
                type="number"
                min={0}
                max={30}
                value={marginMm}
                onChange={(e) => setMarginMm(Number(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="export-size">Taille (pt)</Label>
              <Input
                id="export-size"
                type="number"
                min={9}
                max={14}
                value={fontSizePt}
                onChange={(e) => setFontSizePt(Number(e.target.value))}
                disabled={format === "pdf_visual"}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Police</Label>
            <Select value={fontFamily} onValueChange={(v) => setFontFamily(v as ExportOptions["fontFamily"])}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une police" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {format === "pdf_visual" && (
              <p className="text-xs text-muted-foreground">
                La police ne s’applique pas au PDF visuel (capture de l’aperçu).
              </p>
            )}
          </div>

          {format === "pdf_visual" && (
            <div className="grid gap-2">
              <Label>Qualité (raster)</Label>
              <Select value={String(rasterScale)} onValueChange={(v) => setRasterScale(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Standard (x2)</SelectItem>
                  <SelectItem value="3">Haute (x3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Annuler
          </Button>
          <Button onClick={onExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-1" />
            {isExporting ? "Export…" : "Exporter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

