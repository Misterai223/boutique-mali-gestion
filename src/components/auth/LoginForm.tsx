
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginFormContainer from "./LoginFormContainer";
import { authService } from "@/services/authService";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuthStatus = async () => {
      setIsCheckingAuth(true);
      try {
        const session = await authService.getSession();
        if (session) {
          console.log("Session active trouvée dans LoginForm, redirection vers /");
          // Mettre à jour l'état global avant la redirection
          onLogin();
          // Utiliser replace: true pour éviter les problèmes d'historique de navigation
          navigate("/", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate, onLogin]);
  
  if (isCheckingAuth) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  return <LoginFormContainer onLogin={onLogin} />;
};

export default LoginForm;
