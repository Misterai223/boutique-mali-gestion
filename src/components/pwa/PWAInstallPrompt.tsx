
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

  useEffect(() => {
    // Vérifier si l'application est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher Chrome 67+ d'afficher automatiquement la notification
      e.preventDefault();
      
      // Stocker l'événement pour l'utiliser plus tard
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      toast.success("Application installée avec succès !");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    // Afficher le prompt d'installation
    installPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast.success("Installation en cours...");
    } else {
      toast.info("Installation annulée");
    }
    
    // Réinitialiser l'état
    setInstallPrompt(null);
  };

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
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
  );
};

export default PWAInstallPrompt;
