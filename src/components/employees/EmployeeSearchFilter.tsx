
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface EmployeeSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string | undefined;
  setRoleFilter: (value: string | undefined) => void;
}

const employeeRoles = [
  { value: "manager", label: "Gérant/Manager" },
  { value: "sales_representative", label: "Représentant commercial" },
  { value: "cashier", label: "Caissier" },
  { value: "warehouse_worker", label: "Magasinier" },
  { value: "accountant", label: "Comptable" },
  { value: "secretary", label: "Secrétaire" },
  { value: "technician", label: "Technicien" },
  { value: "other", label: "Autre" }
];

const EmployeeSearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter 
}: EmployeeSearchFilterProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_200px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé par nom ou email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger>
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par rôle" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={undefined as any}>Tous les rôles</SelectItem>
          {employeeRoles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSearchFilter;
