
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

const AccountSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compte utilisateur</CardTitle>
        <CardDescription>
          Gérez vos informations de compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value="admin@example.com"
            readOnly
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            defaultValue="Admin User"
            placeholder="Votre nom complet"
          />
        </div>
        <div className="pt-4">
          <Button>Mettre à jour le profil</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
