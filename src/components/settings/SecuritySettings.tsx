
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast.error("Veuillez entrer votre mot de passe actuel");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      toast.success("Mot de passe changé avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> 
          Sécurité
        </CardTitle>
        <CardDescription>
          Gérez vos paramètres de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-2">
            <Label htmlFor="current-password">Mot de passe actuel</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez votre mot de passe actuel"
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez un nouveau mot de passe"
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre nouveau mot de passe"
            />
          </div>
          <div className="pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Changer le mot de passe"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
