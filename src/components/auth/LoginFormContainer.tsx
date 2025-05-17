
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import LoginHeader from "./LoginHeader";
import LoginError from "./LoginError";
import LoginFormFields from "./LoginFormFields";
import ForgotPassword from "./ForgotPassword";

interface LoginFormContainerProps {
  onLogin: () => void;
}

const LoginFormContainer = ({ onLogin }: LoginFormContainerProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const clearErrors = () => {
    if (errorMsg) {
      setErrorMsg("");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-primary/10 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
          
          <LoginHeader />
          
          <CardContent className="relative space-y-4">
            <LoginError errorMsg={errorMsg} />
            
            <ForgotPassword email={email} setEmail={setEmail} />

            <LoginFormFields 
              email={email}
              setEmail={(value) => {
                setEmail(value);
                clearErrors();
              }}
              password={password}
              setPassword={(value) => {
                setPassword(value);
                clearErrors();
              }}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setErrorMsg={setErrorMsg}
              onLogin={onLogin}
            />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 border-t pt-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm text-center text-muted-foreground"
            >
              <span>Pas encore de compte? </span>
              <span className="font-medium text-primary">
                Contactez votre administrateur
              </span>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginFormContainer;
