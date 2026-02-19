import * as React from "react";
import type { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { PrintDialog } from "./PrintDialog";
import {
  exportAtsPdf,
  exportDocx,
  type ExportFormat,
  type ExportOptions,
} from "@/lib/export/cvExport";

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvData: CVData;
  /**
   * Element id to capture for "PDF visuel".
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

const FORMAT_OPTIONS: { id: ExportFormat | "pdf_print"; label: string; hint?: string }[] = [
  { id: "pdf_print", label: "PDF (Imprimer)", hint: "🖨️ Meilleure qualité - Impression directe A4" },
  { id: "pdf_ats", label: "PDF ATS (texte)", hint: "Texte sélectionnable + liens cliquables" },
  { id: "docx", label: "DOCX", hint: "Éditable (Word) + liens cliquables" },
];

export function ExportDialog({ open, onOpenChange, cvData, visualElementId, defaultFilename }: ExportDialogProps) {
  const [format, setFormat] = React.useState<ExportFormat | "pdf_print">("pdf_print");
  const [filename, setFilename] = React.useState(defaultFilename);
  const [marginMm, setMarginMm] = React.useState<number>(10);
  const [fontFamily, setFontFamily] = React.useState<ExportOptions["fontFamily"]>("sans");
  const [fontSizePt, setFontSizePt] = React.useState<number>(11);
  const [rasterScale, setRasterScale] = React.useState<number>(2);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showPrintDialog, setShowPrintDialog] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setFilename(defaultFilename);
  }, [open, defaultFilename]);

  const onExport = async () => {
    // If PDF print mode, open the print dialog instead
    if (format === "pdf_print") {
      setShowPrintDialog(true);
      return;
    }

    setIsExporting(true);
    const opts: ExportOptions = {
      format: format as ExportFormat,
      filename,
      marginMm,
      fontFamily,
      fontSizePt,
      rasterScale,
    };

    try {
      if (format === "pdf_ats") {
        exportAtsPdf(cvData, opts);
      } else if (format === "docx") {
        await exportDocx(cvData, opts);
      }
      toast.success("Export terminé");
      onOpenChange(false);
    } catch (e: unknown) {
      console.error("Export error:", e);
      const message = e instanceof Error ? e.message : "";
      toast.error(message ? `Erreur export: ${message}` : "Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  const formatHint = FORMAT_OPTIONS.find((f) => f.id === format)?.hint;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat | "pdf_print")}>
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

            {format !== "pdf_print" && (
              <>
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
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
              Annuler
            </Button>
            <Button onClick={onExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-1" />
              {isExporting ? "Préparation…" : "Exporter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Dialog for PDF export */}
      <PrintDialog
        open={showPrintDialog}
        onOpenChange={(open) => {
          setShowPrintDialog(open);
          if (!open) {
            onOpenChange(false);
          }
        }}
        visualElementId={visualElementId}
      />
    </>
  );
}
