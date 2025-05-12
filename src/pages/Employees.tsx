
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { Employee } from "@/types/employee";
import { Plus, Search } from "lucide-react";

// Sample data
const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Amadou Diallo",
    email: "amadou.diallo@example.com",
    phone: "+223 70 12 34 56",
    role: "admin",
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Fatoumata Touré",
    email: "fatoumata.toure@example.com",
    phone: "+223 76 23 45 67",
    role: "manager",
    photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Ibrahim Coulibaly",
    email: "ibrahim.coulibaly@example.com",
    phone: "+223 79 34 56 78",
    role: "cashier",
    photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Aminata Traoré",
    email: "aminata.traore@example.com",
    phone: "+223 65 45 67 89",
    role: "salesperson",
    photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    name: "Moussa Keita",
    email: "moussa.keita@example.com",
    phone: "+223 67 56 78 90",
    role: "salesperson",
    photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEditEmployee = (employee: Employee) => {
    if (currentEmployee) {
      // Edit existing employee
      setEmployees(
        employees.map((e) => (e.id === employee.id ? employee : e))
      );
    } else {
      // Add new employee
      setEmployees([...employees, employee]);
    }
    setCurrentEmployee(undefined);
  };

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé par nom, email ou rôle..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Aucun employé trouvé</p>
        </div>
      )}

      <EmployeeForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={currentEmployee}
        onSave={handleAddEditEmployee}
      />
    </div>
  );
};

export default Employees;
