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
  visualElementId: string;
  defaultFilename: string;
};

export function PrintDialog({ open, onOpenChange, visualElementId, defaultFilename }: PrintDialogProps) {
  const [isPrinting, setIsPrinting] = React.useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const cvElement = document.getElementById(visualElementId);
      if (!cvElement) {
        throw new Error(`Élément CV non trouvé: ${visualElementId}`);
      }

      // Récupérer tout le HTML et les styles du CV
      const cvHtml = cvElement.outerHTML;
      
      // Récupérer TOUS les styles de la page (y compris Tailwind)
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            // Ignorer les feuilles de style externes (CORS)
            return '';
          }
        })
        .join('\n');

      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Impossible d'ouvrir la fenêtre d'impression");
      }

      // Document optimisé pour l'impression avec tous les styles inline
      const printDoc = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${defaultFilename || 'CV'}</title>
    
    <!-- Styles de la page principale (inclut Tailwind) -->
    <style>
        ${styles}
    </style>
    
    <!-- Styles d'impression optimisés -->
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
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
        
        /* Assurer le format A4 */
        #cv-print-wrapper {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
            page-break-after: avoid;
            background: white !important;
        }
        
        /* Forcer les couleurs à l'impression */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        /* Optimiser les polices */
        h1 { font-size: 2rem !important; }
        h2 { font-size: 1.2rem !important; }
        h3 { font-size: 1rem !important; }
        p, span, li { font-size: 13px !important; line-height: 1.6 !important; }
        
        /* Éviter les coupures de page */
        .section-divider,
        .skill-badge,
        [class*="experience"],
        [class*="education"] {
            page-break-inside: avoid;
        }
        
        /* Optimiser les images */
        img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
        }
        
        /* Masquer les ombres pour l'impression */
        @media print {
            [class*="shadow"] {
                box-shadow: none !important;
            }
        }
    </style>
</head>
<body>
    <div id="cv-print-wrapper">
        ${cvHtml}
    </div>
    
    <script>
        (function() {
            // Attendre que tout soit chargé
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initPrint);
            } else {
                initPrint();
            }
            
            function initPrint() {
                // Attendre un peu pour que les images se chargent
                setTimeout(function() {
                    // Lancer l'impression
                    window.print();
                    
                    // Fermer après impression
                    window.addEventListener('afterprint', function() {
                        setTimeout(function() {
                            window.close();
                        }, 100);
                    });
                    
                    // Fallback: fermer après 5 secondes
                    setTimeout(function() {
                        try { window.close(); } catch(e) {}
                    }, 5000);
                }, 500);
            }
        })();
    <\/script>
</body>
</html>`;

      // Écrire le document
      printWindow.document.write(printDoc);
      printWindow.document.close();

      // Fermer le dialog et afficher un message
      toast.success("Fenêtre d'impression ouverte. Sauvegardez en PDF depuis les options.");
      onOpenChange(false);
      setIsPrinting(false);
      
    } catch (e: any) {
      console.error("Print error:", e);
      toast.error(e?.message ? `Erreur: ${e.message}` : "Erreur lors de l'impression");
      setIsPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Imprimer le CV</DialogTitle>
          <DialogDescription>
            Ouvrez la fenêtre d'impression pour sauvegarder votre CV en PDF haute qualité.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Instructions :</strong>
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-4 list-disc">
              <li>Une fenêtre d'impression va s'ouvrir</li>
              <li>Vérifiez l'aperçu de votre CV</li>
              <li>Choisissez "Enregistrer au format PDF"</li>
              <li>Cliquez sur "Enregistrer"</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>📱 Sur mobile :</strong> Le CV s'affichera dans le menu d'impression natif de votre appareil.
            </p>
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