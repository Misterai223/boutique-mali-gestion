
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "./utils/initApp";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/layout/LoadingScreen";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function App() {
  const { isAuthenticated, loading, authInitialized, authError, session, handleLogin, handleLogout } = useAuth();
  const [appLoading, setAppLoading] = useState(true);
  
  // Initialiser l'application
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialiser l'application
        initializeApp();
        
        // Délai pour s'assurer que l'initialisation est terminée
        setTimeout(() => {
          setAppLoading(false);
        }, 500);
        
        // Enregistrer le service worker si disponible
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
              .then(registration => {
                console.log('Service Worker enregistré avec succès');
                
                // Vérifier si une mise à jour est disponible
                registration.addEventListener('updatefound', () => {
                  const newWorker = registration.installing;
                  
                  if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        toast.info("Une mise à jour est disponible!", {
                          action: {
                            label: "Rafraîchir",
                            onClick: () => window.location.reload(),
                          },
                        });
                      }
                    });
                  }
                });
              })
              .catch(error => {
                console.error('Échec de l\'enregistrement du Service Worker:', error);
              });
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'application:", error);
        setAppLoading(false);
      }
    };
    
    initialize();
  }, []);

  // Effet pour signaler les erreurs d'authentification
  useEffect(() => {
    if (authError) {
      console.error("Erreur d'authentification:", authError);
      toast.error("Problème d'authentification. Essayez de vous reconnecter.");
    }
  }, [authError]);

  // Attendre l'initialisation
  if (loading || !authInitialized || appLoading) {
    return <LoadingScreen message="Chargement de l'application..." />;
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        session={session}
      />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 5000,
        }}
      />
    </BrowserRouter>
  );
}

export default App;
