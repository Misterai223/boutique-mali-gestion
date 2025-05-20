
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
          placeholder="Rechercher un employé..."
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
          <SelectItem value="admin">Administrateur</SelectItem>
          <SelectItem value="manager">Gérant</SelectItem>
          <SelectItem value="cashier">Caissier</SelectItem>
          <SelectItem value="salesperson">Vendeur</SelectItem>
          <SelectItem value="user">Utilisateur</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSearchFilter;
