
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
  const { isAuthenticated, loading, authInitialized, authError, handleLogin, handleLogout } = useAuth();
  const [appLoading, setAppLoading] = useState(true);
  const [initComplete, setInitComplete] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);

  // Vérification supplémentaire de la cohérence entre état local et session Supabase
  useEffect(() => {
    const verifyAuthState = async () => {
      try {
        console.log("App - Vérification de la cohérence d'authentification");
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        
        // Détecter et traiter les incohérences
        if (isAuthenticated !== hasSession && authInitialized) {
          console.log(`App - Incohérence détectée - Local: ${isAuthenticated}, Supabase: ${hasSession}`);
          // Ne pas déclencher d'effet secondaire dans cette vérification initiale
        }
        
        setSessionVerified(true);
      } catch (error) {
        console.error("App - Erreur lors de la vérification de session:", error);
        setSessionVerified(true); // Continuer malgré l'erreur
      }
    };
    
    if (authInitialized) {
      verifyAuthState();
    }
  }, [isAuthenticated, authInitialized]);

  useEffect(() => {
    console.log("App - Initialisation démarrée");
    let appInitTimer: ReturnType<typeof setTimeout>;
    
    try {
      // Initialiser l'application
      initializeApp();
      
      // Délai pour s'assurer que l'application est stable
      appInitTimer = setTimeout(() => {
        setAppLoading(false);
        console.log("App - Chargement initial terminé");
        
        // Un délai supplémentaire pour s'assurer que tout est bien stabilisé
        setTimeout(() => {
          setInitComplete(true);
          console.log("App - Initialisation complète");
        }, 300);
      }, 1000);
      
      // Enregistrer le service worker si disponible
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('Service Worker enregistré avec succès:', registration.scope);
              
              // Vérifier si une mise à jour est disponible
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Nouvelle version du Service Worker trouvée!');
                
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
      // En cas d'erreur, on termine quand même le chargement
      setAppLoading(false);
      setInitComplete(true);
    }
    
    return () => {
      if (appInitTimer) clearTimeout(appInitTimer);
    };
  }, []);

  // Effet pour signaler les erreurs d'authentification
  useEffect(() => {
    if (authError) {
      console.error("Erreur d'authentification:", authError);
      toast.error("Problème d'authentification. Essayez de vous reconnecter.");
    }
  }, [authError]);

  // Attendre que l'authentification soit initialisée et que l'app ait fini de charger
  if (loading || !authInitialized || appLoading || !initComplete || !sessionVerified) {
    const message = !authInitialized 
      ? "Vérification de l'authentification..." 
      : !sessionVerified
        ? "Synchronisation de la session..."
        : appLoading 
          ? "Initialisation de l'application..." 
          : "Finalisation du chargement...";
          
    return <LoadingScreen message={message} />;
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 5000,
          className: "my-toast-class"
        }}
      />
    </BrowserRouter>
  );
}

export default App;
