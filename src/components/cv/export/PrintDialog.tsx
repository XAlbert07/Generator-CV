import * as React from "react";
import type { CVData } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Printer } from "lucide-react";

type PrintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvData: CVData;
  /**
   * Element id to capture for printing.
   */
  visualElementId: string;
  defaultFilename: string;
};

export function PrintDialog({ open, onOpenChange, visualElementId }: PrintDialogProps) {
  const [isPrinting, setIsPrinting] = React.useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      // Get the CV element
      const cvElement = document.getElementById(visualElementId);
      if (!cvElement) {
        throw new Error(`Élément CV non trouvé: ${visualElementId}`);
      }

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Impossible d'ouvrir la fenêtre d'impression");
      }

      // Get the element's HTML
      const cvHtml = cvElement.innerHTML;

      // Create the print document with print-optimized styles
      const printDoc = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Impression</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
            padding: 0;
        }
        
        html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Ensure A4 format */
        .cv-print-container {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
            page-break-after: avoid;
            display: flex;
            flex-direction: column;
        }
        
        /* Preserve colors and layout exactly as shown */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        /* Hide elements that shouldn't print */
        .no-print, 
        .print-hide,
        [class*="hide-print"] {
            display: none !important;
        }
        
        /* Optimize fonts for printing */
        body {
            font-size: 13px !important;
        }
        
        h1 {
            font-size: 2rem !important;
        }
        
        h2 {
            font-size: 1.2rem !important;
        }
        
        h3 {
            font-size: 1rem !important;
        }
        
        p, span, li {
            font-size: 13px !important;
            line-height: 1.6 !important;
        }
        
        /* Prevent page breaks inside sections */
        .section-divider,
        .skill-badge,
        [class*="experience"],
        [class*="education"] {
            page-break-inside: avoid;
        }
        
        /* Remove shadows and borders that don't print well */
        [class*="shadow"] {
            box-shadow: none !important;
        }
        
        /* Ensure images scale properly */
        img {
            max-width: 100%;
            height: auto;
        }
        
        /* Optimize for printing - remove extra margins */
        .shadow-xl {
            box-shadow: none !important;
        }
    </style>
</head>
<body>
    <div class="cv-print-container">
        ${cvHtml}
    </div>
    
    <script>
        // Auto-focus and print when document is ready
        setTimeout(() => {
            window.print();
            // Close the window after printing
            setTimeout(() => {
                window.close();
            }, 500);
        }, 500);
    </script>
</body>
</html>`;

      // Write the document
      printWindow.document.write(printDoc);
      printWindow.document.close();

      toast.success("Fenêtre d'impression ouverte. Utilisez Ctrl+P ou la fonction Imprimer pour sauvegarder en PDF.");
      onOpenChange(false);
    } catch (e: any) {
      console.error("Print error:", e);
      toast.error(e?.message ? `Erreur: ${e.message}` : "Erreur lors de l'ouverture de l'impression");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Imprimer le CV</DialogTitle>
          <DialogDescription>
            Vous allez ouvrir une fenêtre d'impression optimisée pour sauvegarder votre CV en PDF avec la meilleure qualité.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Conseil :</strong> Une fenêtre d'impression s'ouvrira. Vous pourrez alors :
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
              <li>Vérifier l'aperçu avant d'imprimer</li>
              <li>Cliquer sur "Enregistrer en tant que PDF" pour le sauvegarder</li>
              <li>Ou imprimer sur papier physique</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPrinting}>
            Annuler
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? "Préparation…" : "Ouvrir l'impression"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
