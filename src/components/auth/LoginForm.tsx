
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, KeyRound } from "lucide-react";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Demo credentials check - in real app would be handled by backend
      if (email === "admin@example.com" && password === "password") {
        toast.success("Connexion réussie");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("isAuthenticated", "true");
        onLogin();
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-[400px] shadow-xl border-2 border-primary/10 bg-gradient-to-br from-card to-secondary/30 animate-fade-in">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex justify-center mb-2">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center tracking-tight">Shop Manager</CardTitle>
        <CardDescription className="text-center text-base">
          Entrez vos identifiants pour accéder à votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="h-4 w-4" />
              </span>
              <Input
                id="email"
                placeholder="nom@exemple.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="pl-10 py-6"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <KeyRound className="h-4 w-4" />
              </span>
              <Input
                id="password"
                placeholder="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pl-10 py-6"
              />
            </div>
          </div>
          <Button type="submit" className="w-full py-6 text-base font-semibold shadow-lg" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          <span>Identifiants de démo:</span>
          <div className="mt-1 font-mono bg-muted p-2 rounded text-sm">
            Email: admin@example.com<br />
            Mot de passe: password
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
