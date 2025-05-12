
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const alerts = [
  {
    id: 1,
    name: "Téléphone Samsung A52",
    status: "low",
    quantity: 3,
  },
  {
    id: 2,
    name: "iPhone 13",
    status: "out",
    quantity: 0,
  },
  {
    id: 3,
    name: "Écouteurs Bluetooth",
    status: "low",
    quantity: 5,
  },
  {
    id: 4,
    name: "Câble USB-C",
    status: "low",
    quantity: 4,
  },
];

const InventoryAlerts = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Alertes de stock</CardTitle>
          <CardDescription>
            Produits à réapprovisionner bientôt
          </CardDescription>
        </div>
        <Package className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-2 rounded-md border"
            >
              <div>
                <p className="font-medium">{alert.name}</p>
                <p className="text-sm text-muted-foreground">
                  Quantité: {alert.quantity}
                </p>
              </div>
              <Badge variant={alert.status === "out" ? "destructive" : "outline"}>
                {alert.status === "out" ? "Rupture" : "Stock bas"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
