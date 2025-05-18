
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function NotificationButton() {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouvelle mise à jour",
      description: "Version 1.2 maintenant disponible",
      read: false,
      time: "Il y a 2 heures"
    },
    {
      id: 2,
      title: "Stock faible",
      description: "Téléphone Xiaomi bientôt épuisé",
      read: false,
      time: "Il y a 5 heures"
    }
  ]);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [pwaPromptDismissed, setPwaPromptDismissed] = useState(
    localStorage.getItem('pwa_prompt_dismissed') === 'true'
  );

  // Vérifier s'il y a des notifications non lues
  useEffect(() => {
    const unreadNotifications = notifications.filter(notif => !notif.read);
    setHasNotifications(unreadNotifications.length > 0);
  }, [notifications]);

  // Afficher la notification PWA après un délai, sauf si déjà rejetée
  useEffect(() => {
    if (!pwaPromptDismissed && !isAppInstalled()) {
      const timer = setTimeout(() => {
        setShowPWAPrompt(true);
      }, 5000); // 5 secondes de délai
      
      return () => clearTimeout(timer);
    }
  }, [pwaPromptDismissed]);

  // Vérifier si l'application est déjà installée
  const isAppInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  };

  // Demander la permission pour les notifications du navigateur
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Votre navigateur ne prend pas en charge les notifications");
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        toast.success("Notifications activées!");
        
        // Exemple de notification
        new Notification("Shop Manager", {
          body: "Vous recevrez désormais des notifications importantes",
          icon: "/icons/icon-192x192.png"
        });
      } else {
        toast.error("Permission de notification refusée");
      }
    } catch (error) {
      console.error("Erreur de demande de permission:", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    toast.success("Toutes les notifications ont été marquées comme lues");
  };

  // Supprimer une notification
  const removeNotification = (id: number) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
  };

  // Ignorer la notification PWA pendant cette session
  const dismissPWAPrompt = () => {
    setShowPWAPrompt(false);
  };

  // Ne plus jamais afficher la notification PWA
  const permanentlyDismissPWAPrompt = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setPwaPromptDismissed(true);
    setShowPWAPrompt(false);
  };

  // Installer l'application PWA
  const handleInstallPWA = () => {
    setShowPWAPrompt(false);
    
    // Envoyer un message au service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_INSTALL_PROMPT'
      });
    }
    
    toast.info("Suivez les instructions pour installer l'application", {
      duration: 5000
    });
  };

  return (
    <>
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative hover:bg-muted transition-all duration-200"
                >
                  <Bell className="h-5 w-5" />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={requestNotificationPermission}
              >
                Activer
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                disabled={!hasNotifications}
              >
                Marquer comme lu
              </Button>
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 border-b last:border-0 flex justify-between ${
                    notif.read ? 'bg-background' : 'bg-muted/30'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-medium">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{notif.time}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeNotification(notif.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucune notification
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Dialogue d'installation PWA plus discret */}
      <AlertDialog open={showPWAPrompt} onOpenChange={setShowPWAPrompt}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Installer l'application</AlertDialogTitle>
            <AlertDialogDescription>
              Installez Shop Manager sur votre appareil pour un accès rapide et une expérience optimale, même hors connexion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={dismissPWAPrompt} className="mt-0">
              Plus tard
            </AlertDialogCancel>
            <Button variant="outline" size="sm" onClick={permanentlyDismissPWAPrompt}>
              Ne plus afficher
            </Button>
            <AlertDialogAction onClick={handleInstallPWA}>
              Installer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
