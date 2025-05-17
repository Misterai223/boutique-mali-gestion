
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginFormContainer from "./LoginFormContainer";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);
  
  return <LoginFormContainer onLogin={onLogin} />;
};

export default LoginForm;
