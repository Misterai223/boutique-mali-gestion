
import { useState } from "react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import LoginButton from "./LoginButton";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setErrorMsg: (value: string) => void;
  onLogin: () => void;
}

const LoginFormFields = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  setIsLoading,
  setErrorMsg,
  onLogin
}: LoginFormFieldsProps) => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des entrées
    if (!email.trim()) {
      setErrorMsg("L'adresse email est requise");
      return;
    }
    
    if (!password) {
      setErrorMsg("Le mot de passe est requis");
      return;
    }
    
    // Réinitialiser l'état d'erreur et activer le chargement
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      console.log("Tentative de connexion avec:", email);
      
      // Utiliser simpleLogin pour une meilleure compatibilité
      const { data, error } = await authService.simpleLogin(email, password);
      
      if (error) {
        console.error("Erreur lors de la connexion:", error.message);
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }
      
      if (data?.session) {
        console.log("Session établie avec succès:", data.session.user.email);
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Connexion réussie!");
        onLogin();
        navigate('/', { replace: true });
      } else {
        console.error("Session non établie malgré une réponse sans erreur");
        setErrorMsg("Impossible d'établir la session. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Exception non gérée lors de la connexion:", error);
      setErrorMsg(error.message || "Une erreur inattendue s'est produite");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div 
        className="space-y-3"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <EmailInput 
          email={email}
          setEmail={setEmail}
        />
        
        <PasswordInput
          password={password}
          setPassword={setPassword}
          onForgotPassword={(e) => {
            e.preventDefault();
            // Use the ForgotPassword component functionality
            if (!email.trim()) {
              setErrorMsg("Veuillez entrer votre email pour réinitialiser votre mot de passe");
              return;
            }
          }}
        />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <LoginButton isLoading={isLoading} />
      </motion.div>
    </form>
  );
};

export default LoginFormFields;
