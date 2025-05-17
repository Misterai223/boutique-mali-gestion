
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginFormContainer from "./LoginFormContainer";
import { authService } from "@/services/authService";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false); // Ajouter un état pour éviter les redirections multiples
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuthStatus = async () => {
      if (hasRedirected) return; // Ne pas continuer si déjà redirigé
      
      setIsCheckingAuth(true);
      try {
        const session = await authService.getSession();
        if (session) {
          console.log("Session active trouvée dans LoginForm, redirection vers /");
          setHasRedirected(true); // Marquer comme redirigé
          onLogin(); // Met à jour l'état d'authentification
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate, onLogin, hasRedirected]);
  
  if (isCheckingAuth) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  return <LoginFormContainer onLogin={onLogin} />;
};

export default LoginForm;
