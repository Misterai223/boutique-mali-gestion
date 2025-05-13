
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
import { User } from "lucide-react";
import { toast } from "sonner";

const AccountSettings = () => {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      toast.success("Profil mis à jour avec succès");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> 
          Compte utilisateur
        </CardTitle>
        <CardDescription>
          Gérez vos informations de compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              L'adresse email ne peut pas être modifiée
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom complet"
            />
          </div>
          <div className="pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Mettre à jour le profil"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
