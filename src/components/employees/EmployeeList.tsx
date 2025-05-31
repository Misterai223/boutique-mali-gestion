
import { useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { employeeService } from "@/services/employeeService";
import { toast } from "sonner";

interface EmployeeListProps {
  onEditEmployee?: (employee: Employee) => void;
  refreshTrigger?: number;
}

const EmployeeList = ({ 
  onEditEmployee,
  refreshTrigger = 0
}: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Employee>("full_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Load employees
  useEffect(() => {
    loadEmployees();
  }, [refreshTrigger]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = employee.full_name || "";
    const email = employee.email || "";
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return 0;
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column: keyof Employee) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleEdit = (employee: Employee) => {
    if (onEditEmployee) {
      onEditEmployee(employee);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${employee.full_name} ?`)) {
      try {
        await employeeService.deleteEmployee(employee.id);
        toast.success('Employé supprimé avec succès');
        loadEmployees(); // Refresh the list
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Erreur lors de la suppression de l\'employé');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé par nom ou email..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
          disabled={isLoading}
        />
      </div>
      <ScrollArea>
        <Table>
          <TableCaption>Liste des employés de l'entreprise.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("full_name")} className="cursor-pointer">
                Nom
                {sortBy === "full_name" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </TableHead>
              <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                Email
                {sortBy === "email" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(employee)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Aucun employé trouvé.
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default EmployeeList;
