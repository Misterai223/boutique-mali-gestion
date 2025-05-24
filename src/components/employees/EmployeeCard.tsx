
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/employee";
import { Edit, User, Trash, Mail, Phone } from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeCard = ({ employee, onEdit, onDelete }: EmployeeCardProps) => {
  // Function to determine the badge variant based on the role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "manager":
        return "default";
      case "sales_representative":
        return "secondary";
      case "cashier":
        return "outline";
      case "warehouse_worker":
        return "secondary";
      case "accountant":
        return "outline";
      default:
        return "outline";
    }
  };

  // Function to translate role
  const translateRole = (role: string) => {
    switch (role) {
      case "manager":
        return "Gérant/Manager";
      case "sales_representative":
        return "Représentant commercial";
      case "cashier":
        return "Caissier";
      case "warehouse_worker":
        return "Magasinier";
      case "accountant":
        return "Comptable";
      case "secretary":
        return "Secrétaire";
      case "technician":
        return "Technicien";
      case "other":
        return "Autre";
      default:
        return role;
    }
  };

  return (
    <Card className="overflow-hidden card-hover transition-all hover:shadow-md">
      <div className="aspect-square relative bg-muted">
        {employee.photo_url ? (
          <img
            src={employee.photo_url}
            alt={employee.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <User className="h-12 w-12 text-secondary-foreground" />
          </div>
        )}
        <Badge
          variant={getRoleBadgeVariant(employee.role)}
          className="absolute top-2 right-2"
        >
          {translateRole(employee.role)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div>
          <h3 className="font-medium text-lg truncate">{employee.full_name}</h3>
          {employee.email && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground truncate mt-1">
              <Mail className="h-3 w-3" />
              <span>{employee.email}</span>
            </div>
          )}
          {employee.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Phone className="h-3 w-3" />
              <span>{employee.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(employee)}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(employee)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;
