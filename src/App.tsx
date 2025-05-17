
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "./utils/initApp";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/layout/LoadingScreen";
import { Toaster } from "sonner";

function App() {
  const { isAuthenticated, loading, handleLogin, handleLogout } = useAuth();

  useEffect(() => {
    // Initialiser l'application
    initializeApp();
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
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
