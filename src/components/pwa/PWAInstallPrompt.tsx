
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Force show PWA install prompt in development mode for testing
    const isDev = process.env.NODE_ENV === 'development';
    
    // Vérifier si l'application est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Override isInstallable status in development for testing
    if (isDev) {
      console.log("Mode développement: Affichage forcé du bouton d'installation PWA");
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher Chrome 67+ d'afficher automatiquement la notification
      e.preventDefault();
      
      // Stocker l'événement pour l'utiliser plus tard
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      console.log("Événement beforeinstallprompt capturé", e);
      
      // Afficher une notification pour informer l'utilisateur
      toast.info("Cette application peut être installée sur votre appareil", {
        action: {
          label: "Installer",
          onClick: () => handleInstallClick(),
        },
        duration: 15000, // Durée plus longue pour donner le temps à l'utilisateur de voir la notification
        id: "pwa-install", // ID unique pour éviter les doublons
      });
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      toast.success("Application installée avec succès !");
      console.log("Application installée avec succès");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Retardez l'affichage du bouton pour les navigateurs mobiles
    const timeout = setTimeout(() => {
      if (!isInstalled && !isInstallable && !isDev) {
        // Si après 5 secondes aucun événement n'a été déclenché, vérifier manuellement
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS || isAndroid) {
          setIsInstallable(true);
          console.log("Activation manuelle du bouton d'installation pour mobile");
          
          // Notification pour les appareils mobiles
          toast.info("Ajoutez cette application à votre écran d'accueil", {
            duration: 10000,
          });
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timeout);
    };
  }, [isInstalled, isInstallable]);

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        console.log("Tentative d'affichage du prompt d'installation");
        // Afficher le prompt d'installation
        await installPrompt.prompt();

        // Attendre la réponse de l'utilisateur
        const choiceResult = await installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          toast.success("Installation en cours...");
          console.log("Installation acceptée");
        } else {
          toast.info("Installation annulée");
          console.log("Installation refusée");
        }
      } catch (error) {
        console.error("Erreur lors de l'installation:", error);
        toast.error("Erreur lors de l'installation");
      }
      
      // Réinitialiser l'état
      setInstallPrompt(null);
    } else {
      // Instruction manuelle pour iOS où beforeinstallprompt n'est pas supporté
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast.info("Pour installer l'application sur iOS: appuyez sur 'Partager' puis 'Sur l'écran d'accueil'", {
          duration: 10000,
        });
      } else {
        // Instructions générales pour les autres navigateurs
        toast.info("Utilisez le menu de votre navigateur pour installer l'application", {
          duration: 10000,
        });
      }
    }
  };

  // Si l'application est déjà installée, ne pas afficher le bouton
  if (isInstalled) {
    return null;
  }

  // Afficher le bouton si l'application est installable ou en mode développement
  return isInstallable ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 animate-pulse hover:animate-none bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
        >
          <Download className="h-4 w-4" />
          <span>Installer</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Installez Shop Manager</h3>
          <p className="text-sm text-muted-foreground">
            Installez cette application sur votre appareil pour un accès rapide et une meilleure expérience.
            Certaines fonctionnalités sont disponibles hors connexion.
          </p>
          <div className="flex justify-end gap-2">
            <Button 
              variant="default"
              onClick={handleInstallClick}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Installer maintenant</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ) : null;
};

export default PWAInstallPrompt;
