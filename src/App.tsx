
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "./utils/initApp";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/layout/LoadingScreen";
import { Toaster } from "sonner";
import { toast } from "sonner";

function App() {
  const { isAuthenticated, loading, handleLogin, handleLogout } = useAuth();

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
            
            // Écouter les messages du Service Worker
            navigator.serviceWorker.addEventListener('message', (event) => {
              console.log('Message du Service Worker:', event.data);
              
              if (event.data && event.data.type === 'TRIGGER_INSTALL_PROMPT') {
                console.log('Déclenchement du prompt d\'installation depuis le SW');
                // Déclencher le prompt d'installation via une notification
                toast.info("Installez l'application", {
                  description: "Pour une meilleure expérience utilisateur",
                  action: {
                    label: "Installer",
                    onClick: () => {
                      // Cette fonction sera détectée par PWAInstallPrompt via l'événement personnalisé
                      const event = new CustomEvent('pwa-install-request');
                      window.dispatchEvent(event);
                    },
                  },
                  duration: 10000,
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

  if (loading) {
    return <LoadingScreen />;
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
