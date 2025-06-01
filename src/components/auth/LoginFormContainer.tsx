
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import LoginHeader from "./LoginHeader";
import LoginError from "./LoginError";
import LoginFormFields from "./LoginFormFields";
import ForgotPassword from "./ForgotPassword";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoginFormContainerProps {
  onLogin: () => void;
}

const LoginFormContainer = ({ onLogin }: LoginFormContainerProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const isMobile = useIsMobile();
  
  const clearErrors = () => {
    if (errorMsg) {
      setErrorMsg("");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 p-3 sm:p-4">
      {/* Animated background elements - optimisés pour mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute -top-1/2 -left-1/2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl ${
            isMobile ? 'w-64 h-64' : 'w-full h-full'
          }`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className={`absolute -bottom-1/2 -right-1/2 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl ${
            isMobile ? 'w-64 h-64' : 'w-full h-full'
          }`}
        />
        
        {/* Floating particles - réduits sur mobile */}
        {!isMobile && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -100, -20],
              x: [-10, 10, -10],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 100
        }}
        className="w-full max-w-sm sm:max-w-md relative z-10"
      >
        <Card className="overflow-hidden border-0 shadow-2xl backdrop-blur-xl bg-background/80 relative">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-background/90 to-background/70 rounded-lg" />
          
          {/* Animated border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-lg opacity-30"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(var(--primary-rgb), 0.3), transparent, rgba(var(--accent-rgb), 0.3), transparent)"
            }}
          />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <LoginHeader />
            </motion.div>
            
            <CardContent className={`space-y-4 sm:space-y-6 ${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <LoginError errorMsg={errorMsg} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <ForgotPassword email={email} setEmail={setEmail} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
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
              </motion.div>
            </CardContent>
            
            <CardFooter className={`flex flex-col space-y-3 sm:space-y-4 border-t border-border/50 pt-4 sm:pt-6 bg-muted/30 ${
              isMobile ? 'px-4 pb-4' : 'px-6 pb-6'
            }`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-center text-muted-foreground leading-relaxed`}
              >
                <div className="space-y-2">
                  <p className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                    <span>Pas encore de compte?</span>
                  </p>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="font-medium text-primary cursor-pointer hover:text-primary/80 transition-colors inline-block"
                  >
                    Contactez votre administrateur
                  </motion.span>
                </div>
              </motion.div>
              
              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className={`flex items-center justify-center gap-2 ${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground/80`}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
                <span>Connexion sécurisée</span>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginFormContainer;
