
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "./utils/initApp";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/layout/LoadingScreen";
import { Toaster } from "sonner";
import { toast } from "sonner";

function App() {
  const { isAuthenticated, loading, authInitialized, handleLogin, handleLogout } = useAuth();

  useEffect(() => {
    // Initialiser l'application
    initializeApp();
    
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
  }, []);

  // Attendre que l'authentification soit initialisée avant de rendre l'application
  if (loading || !authInitialized) {
    return <LoadingScreen message="Initialisation de l'application..." />;
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
