
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
    
    console.log("=== DÉBUT DU PROCESSUS DE CONNEXION ===");
    
    // Validation des entrées
    if (!email.trim()) {
      setErrorMsg("L'adresse email est requise");
      return;
    }
    
    if (!password) {
      setErrorMsg("Le mot de passe est requis");
      return;
    }
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Format d'email invalide");
      return;
    }
    
    // Réinitialiser l'état d'erreur et activer le chargement
    setErrorMsg("");
    setIsLoading(true);
    
    try {
      console.log("Tentative de connexion avec email:", email.trim());
      console.log("Longueur du mot de passe:", password.length);
      
      // Utiliser loginWithErrorHandling pour une meilleure gestion d'erreurs
      const { data, error } = await authService.loginWithErrorHandling(
        email.trim().toLowerCase(), 
        password
      );
      
      if (error) {
        console.error("Erreur retournée par le service:", error.message);
        setErrorMsg(error.message);
        setIsLoading(false);
        
        // Afficher aussi un toast pour plus de visibilité
        toast.error(error.message);
        return;
      }
      
      if (data?.session) {
        console.log("=== CONNEXION RÉUSSIE ===");
        console.log("Email utilisateur:", data.session.user.email);
        console.log("ID utilisateur:", data.session.user.id);
        
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Connexion réussie!");
        
        // Attendre un peu avant la redirection pour laisser le temps à l'état de se mettre à jour
        setTimeout(() => {
          onLogin();
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.error("=== ÉCHEC: AUCUNE SESSION ===");
        const errorMsg = "Impossible d'établir la session. Veuillez réessayer.";
        setErrorMsg(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
      }
    } catch (exception: any) {
      console.error("=== EXCEPTION NON GÉRÉE ===");
      console.error("Exception:", exception);
      
      const errorMsg = "Erreur technique. Consultez la console pour plus de détails.";
      setErrorMsg(errorMsg);
      toast.error(errorMsg);
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
