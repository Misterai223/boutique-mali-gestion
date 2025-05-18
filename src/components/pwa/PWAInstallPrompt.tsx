
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isDismissed, setIsDismissed] = useState(
    localStorage.getItem('pwa_prompt_dismissed') === 'true'
  );

  useEffect(() => {
    // Vérifier si l'application est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Vérifier si l'utilisateur a déjà rejeté l'installation
    if (isDismissed) {
      return;
    }

    // Force show PWA install prompt in development mode for testing
    const isDev = process.env.NODE_ENV === 'development';
    
    // Override isInstallable status in development for testing
    if (isDev) {
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher Chrome 67+ d'afficher automatiquement la notification
      e.preventDefault();
      console.log("Événement beforeinstallprompt capturé", e);
      
      // Stocker l'événement pour l'utiliser plus tard
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log("Application installée avec succès");
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPopup(false);
      setShowDrawer(false);
      toast.success("Application installée avec succès !");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Retardez l'affichage du bouton pour les navigateurs mobiles
    const timeout = setTimeout(() => {
      if (!isInstalled && !isInstallable && !isDismissed) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS || isAndroid || isDev) {
          setIsInstallable(true);
          // Afficher une notification plus discrète
          toast.info("Vous pouvez installer cette application", {
            duration: 5000,
            action: {
              label: "Installer",
              onClick: () => handleInstallClick(),
            },
          });
        }
      }
    }, 10000); // Attendre 10 secondes

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timeout);
    };
  }, [isInstalled, isInstallable, isDismissed]);

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          toast.success("Installation en cours...");
        } else {
          toast.info("Installation annulée");
        }
      } catch (error) {
        console.error("Erreur lors de l'installation:", error);
      }
      
      setInstallPrompt(null);
    } else {
      // Instructions manuelles
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast.info("Pour installer l'application sur iOS: appuyez sur 'Partager' puis 'Sur l'écran d'accueil'", {
          duration: 8000,
        });
      } else {
        toast.info("Utilisez le menu de votre navigateur pour installer l'application", {
          duration: 8000,
        });
      }
    }
    
    // Fermer les interfaces
    setShowPopup(false);
    setShowDrawer(false);
  };

  const dismissInstallPrompt = () => {
    // Fermer sans mémoriser la décision
    setShowPopup(false);
    setShowDrawer(false);
  };

  const permanentlyDismiss = () => {
    // Mémoriser que l'utilisateur ne souhaite plus voir ce message
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setIsDismissed(true);
    setShowPopup(false);
    setShowDrawer(false);
  };

  // Si l'application est déjà installée, ne pas afficher le bouton
  if (isInstalled || isDismissed) {
    return null;
  }

  // Afficher le bouton si l'application est installable
  return (
    <>
      {isInstallable && (
        <Popover open={showPopup} onOpenChange={setShowPopup}>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1 bg-green-100/50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
              onClick={() => setShowPopup(true)}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Installer</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-sm font-medium">Installer l'application</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={dismissInstallPrompt}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
            <div className="p-3 space-y-3">
              <p className="text-xs text-muted-foreground">
                Installez cette application sur votre appareil pour un accès rapide et une meilleure expérience.
              </p>
              <div className="flex justify-between items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={permanentlyDismiss}
                >
                  Ne plus afficher
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  className="text-xs"
                  onClick={handleInstallClick}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Installer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Version mobile avec drawer au lieu d'une alerte fixe */}
      <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Installer l'application</DrawerTitle>
            <DrawerDescription>
              Accédez rapidement à Shop Manager depuis votre écran d'accueil
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-0">
            <Button onClick={handleInstallClick}>
              <Download className="h-4 w-4 mr-2" />
              Installer maintenant
            </Button>
            <div className="flex justify-between w-full">
              <Button variant="outline" size="sm" onClick={permanentlyDismiss}>
                Ne plus afficher
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  Plus tard
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PWAInstallPrompt;
