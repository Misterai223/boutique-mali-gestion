
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "./utils/initApp";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import LoadingScreen from "./components/layout/LoadingScreen";

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
    </BrowserRouter>
  );
}

export default App;
