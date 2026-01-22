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

  // Méthode d'impression pour mobile - utilise un iframe caché avec un document HTML complet
  const handleMobilePrint = async () => {
    const cvElement = document.getElementById(visualElementId);
    if (!cvElement) {
      throw new Error(`Élément CV non trouvé: ${visualElementId}`);
    }

    // On récupère le HTML du CV exactement comme sur desktop
    const cvHtml = cvElement.innerHTML;

    // On crée le même document HTML complet que sur desktop, mais dans un iframe
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
</body>
</html>`;

    // Créer un iframe complètement invisible dans la page actuelle
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    
    document.body.appendChild(iframe);

    // Écrire le document HTML complet dans l'iframe
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      iframe.remove();
      throw new Error("Impossible d'accéder au document de l'iframe");
    }

    iframeDoc.open();
    iframeDoc.write(printDoc);
    iframeDoc.close();

    // Maintenant vient la partie critique : attendre que TOUT soit chargé
    // On va utiliser plusieurs mécanismes de sécurité pour être absolument certain
    // que Tailwind CSS est complètement chargé avant de lancer l'impression
    
    return new Promise<void>((resolve, reject) => {
      let printExecuted = false;
      let loadTimeout: number;
      
      // Fonction qui lance réellement l'impression, une seule fois
      const executePrint = () => {
        if (printExecuted) return;
        printExecuted = true;
        
        // Nettoyer le timeout si on arrive ici avant
        if (loadTimeout) clearTimeout(loadTimeout);
        
        try {
          // Sur certains navigateurs mobiles, on doit utiliser la méthode print du contentWindow
          const printWindow = iframe.contentWindow;
          if (!printWindow) {
            throw new Error("Impossible d'accéder à la fenêtre de l'iframe");
          }
          
          // Lancer l'impression depuis l'iframe
          printWindow.focus();
          printWindow.print();
          
          toast.success("Impression lancée. Utilisez 'Enregistrer en PDF' dans les options.");
          
          // Nettoyer l'iframe après l'impression ou après un délai
          const cleanup = () => {
            iframe.remove();
            resolve();
          };
          
          // Écouter la fin de l'impression si le navigateur le supporte
          if ('onafterprint' in printWindow) {
            printWindow.addEventListener('afterprint', cleanup);
          }
          
          // Fallback : nettoyer après 10 secondes de toute façon
          setTimeout(cleanup, 10000);
          
        } catch (error) {
          iframe.remove();
          reject(error);
        }
      };
      
      // Premier niveau de détection : l'événement load de l'iframe
      // Cet événement se déclenche quand TOUTES les ressources sont chargées
      iframe.addEventListener('load', () => {
        console.log('Iframe loaded - ressources externes chargées');
        
        // Même après le load, on attend encore un peu pour être sûr
        // que le navigateur a fini de calculer tous les layouts et d'appliquer
        // tous les styles CSS. Sur mobile, ce calcul peut prendre plus de temps.
        setTimeout(() => {
          console.log('Délai de sécurité écoulé - lancement de l\'impression');
          executePrint();
        }, 1000); // 1 seconde de marge de sécurité après le load
      });
      
      // Deuxième niveau de sécurité : un timeout maximum
      // Si après 15 secondes rien ne s'est passé (connexion très lente ou CDN inaccessible),
      // on lance l'impression quand même pour ne pas bloquer l'utilisateur indéfiniment
      loadTimeout = window.setTimeout(() => {
        console.warn('Timeout atteint - lancement forcé de l\'impression');
        executePrint();
      }, 15000);
    });
  };

  // Méthode d'impression pour ordinateur - ouvre une nouvelle fenêtre
  // CETTE PARTIE N'EST PAS MODIFIÉE
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