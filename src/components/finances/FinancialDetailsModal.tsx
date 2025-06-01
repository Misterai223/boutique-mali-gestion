
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, TrendingUp, TrendingDown, DollarSign, FileText, Download } from "lucide-react";

interface FinancialDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinancialDetailsModal = ({ open, onOpenChange }: FinancialDetailsModalProps) => {
  const financialMetrics = [
    {
      label: "Revenus totaux",
      value: "5 050 000 F CFA",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      label: "Dépenses totales",
      value: "2 620 000 F CFA",
      change: "+8%",
      trend: "up",
      icon: TrendingDown,
      color: "text-red-600"
    },
    {
      label: "Bénéfice net",
      value: "2 430 000 F CFA",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600"
    }
  ];

  const monthlyData = [
    { month: "Janvier", revenus: 800000, depenses: 450000, benefice: 350000 },
    { month: "Février", revenus: 950000, depenses: 500000, benefice: 450000 },
    { month: "Mars", revenus: 1000000, depenses: 520000, benefice: 480000 },
    { month: "Avril", revenus: 1200000, depenses: 550000, benefice: 650000 },
    { month: "Mai", revenus: 1100000, depenses: 600000, benefice: 500000 }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Détails de la performance financière
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financialMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-xl font-bold">{metric.value}</p>
                      <Badge variant="secondary" className={`mt-1 ${metric.color}`}>
                        {metric.change} vs mois précédent
                      </Badge>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Détails mensuels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Détails mensuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{data.month}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenus</p>
                      <p className="text-green-600 font-medium">
                        {data.revenus.toLocaleString()} F CFA
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dépenses</p>
                      <p className="text-red-600 font-medium">
                        {data.depenses.toLocaleString()} F CFA
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bénéfice</p>
                      <p className="text-blue-600 font-medium">
                        {data.benefice.toLocaleString()} F CFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter les détails
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialDetailsModal;
