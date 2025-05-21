
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/layout/LoadingScreen";
import { initializeApp } from "./utils/initApp";

function App() {
  const { isAuthenticated, loading, handleLogin, handleLogout } = useAuth();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    // Initialiser l'application de manière asynchrone
    const initialize = async () => {
      await initializeApp();
      setAppInitialized(true);
      console.log("App initialized, authentication state:", isAuthenticated);
    };
    
    initialize();
  }, [isAuthenticated]);

  if (loading || !appInitialized) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
    </BrowserRouter>
  );
}

export default App;
