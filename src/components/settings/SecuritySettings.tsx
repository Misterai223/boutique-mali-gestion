
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

const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
        <CardDescription>
          Gérez vos paramètres de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Mot de passe actuel</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="Entrez votre mot de passe actuel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Entrez un nouveau mot de passe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirmez votre nouveau mot de passe"
          />
        </div>
        <div className="pt-4">
          <Button>Changer le mot de passe</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
