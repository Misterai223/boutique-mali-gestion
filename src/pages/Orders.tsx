
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Orders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
        <p className="text-muted-foreground">
          Gérez les commandes de votre boutique
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
          <CardDescription>
            Consultez et gérez toutes vos commandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette fonctionnalité sera implémentée prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
