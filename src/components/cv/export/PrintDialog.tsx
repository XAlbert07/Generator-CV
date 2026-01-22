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

  // Détection si l'utilisateur est sur mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {
      // Sur mobile, on utilise une approche différente plus fiable
      if (isMobileDevice()) {
        await handleMobilePrint();
      } else {
        await handleDesktopPrint();
      }
      
      // Fermer le dialogue après avoir lancé l'impression
      onOpenChange(false);
      setIsPrinting(false);
    } catch (e: any) {
      console.error("Print error:", e);
      toast.error(e?.message ? `Erreur: ${e.message}` : "Erreur lors de l'ouverture de l'impression");
      setIsPrinting(false);
    }
  };

  // Méthode d'impression pour mobile - utilise l'impression directe de la page actuelle
  const handleMobilePrint = async () => {
    const cvElement = document.getElementById(visualElementId);
    if (!cvElement) {
      throw new Error(`Élément CV non trouvé: ${visualElementId}`);
    }

    // On crée un style temporaire qui masque tout sauf le CV lors de l'impression
    const printStyle = document.createElement('style');
    printStyle.id = 'mobile-print-styles';
    printStyle.textContent = `
      @media print {
        /* Masquer tout le corps de la page */
        body > *:not(#print-only-wrapper) {
          display: none !important;
        }
        
        /* Configuration de la page A4 */
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
        
        /* Le wrapper d'impression devient visible */
        #print-only-wrapper {
          display: block !important;
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box;
        }
        
        /* Préserver les couleurs exactement */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Éviter les coupures de page à l'intérieur des sections */
        .section-divider,
        .skill-badge,
        [class*="experience"],
        [class*="education"] {
          page-break-inside: avoid;
        }
        
        /* Supprimer les ombres qui ne s'impriment pas bien */
        [class*="shadow"] {
          box-shadow: none !important;
        }
        
        /* Optimiser la taille des polices pour l'impression */
        body {
          font-size: 13px !important;
        }
        
        h1 { font-size: 2rem !important; }
        h2 { font-size: 1.2rem !important; }
        h3 { font-size: 1rem !important; }
        p, span, li { font-size: 13px !important; line-height: 1.6 !important; }
      }
    `;
    
    document.head.appendChild(printStyle);

    // Créer un conteneur temporaire qui sera visible uniquement lors de l'impression
    const printWrapper = document.createElement('div');
    printWrapper.id = 'print-only-wrapper';
    printWrapper.style.display = 'none'; // Masqué par défaut, visible seulement en @media print
    
    // Cloner le CV pour l'ajouter au wrapper d'impression
    const cvClone = cvElement.cloneNode(true) as HTMLElement;
    printWrapper.appendChild(cvClone);
    document.body.appendChild(printWrapper);

    // Attendre un court instant pour que le navigateur applique les styles
    await new Promise(resolve => setTimeout(resolve, 100));

    // Déclencher l'impression native
    window.print();

    // Nettoyer après l'impression (on attend que l'utilisateur ferme le dialogue d'impression)
    const cleanupPrint = () => {
      // Supprimer le wrapper temporaire et les styles
      printWrapper?.remove();
      printStyle?.remove();
      
      // Retirer l'écouteur
      window.removeEventListener('afterprint', cleanupPrint);
    };
    
    // Nettoyer après que l'utilisateur ait terminé avec le dialogue d'impression
    window.addEventListener('afterprint', cleanupPrint);
    
    // Fallback de nettoyage après 10 secondes au cas où 'afterprint' ne se déclenche pas
    setTimeout(cleanupPrint, 10000);

    toast.success("Impression lancée. Utilisez 'Enregistrer en PDF' dans les options.");
  };

  // Méthode d'impression pour ordinateur - ouvre une nouvelle fenêtre
  const handleDesktopPrint = async () => {
    const cvElement = document.getElementById(visualElementId);
    if (!cvElement) {
      throw new Error(`Élément CV non trouvé: ${visualElementId}`);
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("Impossible d'ouvrir la fenêtre d'impression");
    }

    const cvHtml = cvElement.innerHTML;

    const printDoc = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - Impression</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
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
        
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        .no-print, 
        .print-hide,
        [class*="hide-print"] {
            display: none !important;
        }
        
        body { font-size: 13px !important; }
        h1 { font-size: 2rem !important; }
        h2 { font-size: 1.2rem !important; }
        h3 { font-size: 1rem !important; }
        p, span, li { font-size: 13px !important; line-height: 1.6 !important; }
        
        .section-divider,
        .skill-badge,
        [class*="experience"],
        [class*="education"] {
            page-break-inside: avoid;
        }
        
        [class*="shadow"] {
            box-shadow: none !important;
        }
        
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="cv-print-container">
        ${cvHtml}
    </div>
    
    <script>
        (function() {
            function attemptPrint() {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', attemptPrint);
                    return;
                }
                
                setTimeout(function() {
                    window.print();
                    
                    window.addEventListener('afterprint', function() {
                        window.close();
                    });
                    
                    setTimeout(function() {
                        try {
                            window.close();
                        } catch(e) {
                            console.log('Window close prevented');
                        }
                    }, 5000);
                }, 800);
            }
            
            attemptPrint();
            
            window.addEventListener('load', function() {
                console.log('Page fully loaded');
            });
        })();
    <\/script>
</body>
</html>`;

    printWindow.document.write(printDoc);
    printWindow.document.close();

    toast.success("Fenêtre d'impression ouverte. Utilisez les options de votre appareil pour sauvegarder en PDF.");
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