
import { Bell } from "lucide-react";
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

  // Vérifier s'il y a des notifications non lues
  useEffect(() => {
    const unreadNotifications = notifications.filter(notif => !notif.read);
    setHasNotifications(unreadNotifications.length > 0);
  }, [notifications]);

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

  return (
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
                  ×
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
  );
}
