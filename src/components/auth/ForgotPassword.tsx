
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ForgotPasswordProps {
  email: string;
  setEmail: (email: string) => void;
}

const ForgotPassword = ({ email, setEmail }: ForgotPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordSubmitted, setIsForgotPasswordSubmitted] = useState(false);

  const handlePasswordRecovery = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Veuillez entrer votre email pour réinitialiser votre mot de passe");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await authService.resetPassword(email);
      if (success) {
        setIsForgotPasswordSubmitted(true);
        toast.success(`Instructions de récupération envoyées à ${email}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de récupération:", error);
      toast.error("Impossible d'envoyer l'email de récupération");
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPasswordSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-primary/10 rounded-md text-center"
      >
        <h3 className="font-medium mb-2">Email envoyé!</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Si un compte existe avec {email}, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsForgotPasswordSubmitted(false);
            setEmail("");
          }}
        >
          Retour à la connexion
        </Button>
      </motion.div>
    );
  }

  return null;
};

export default ForgotPassword;
