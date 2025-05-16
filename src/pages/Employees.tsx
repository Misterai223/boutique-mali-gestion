
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { Employee } from "@/types/employee";
import { Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // Chargement des employés depuis le profil ou utilisation de données par défaut
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'manager', 'cashier', 'salesperson']);
      
      if (error) {
        throw error;
      }
      
      // Convertir les profils en employés
      if (profiles && profiles.length > 0) {
        const mappedEmployees: Employee[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.full_name || 'Sans nom',
          email: '', // Supabase ne fournit pas directement l'email via profiles
          phone: '', // À définir via le formulaire de modification
          role: profile.role,
          photoUrl: profile.avatar_url || undefined,
        }));
        
        setEmployees(mappedEmployees);
      }
    } catch (error: any) {
      toast.error(`Erreur lors du chargement des employés: ${error.message}`);
      console.error("Erreur lors du chargement des employés:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEditEmployee = async (employee: Employee) => {
    try {
      if (currentEmployee) {
        // Mettre à jour l'employé existant via le profil
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: employee.name,
            avatar_url: employee.photoUrl,
            role: employee.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', employee.id);
          
        if (error) throw error;
        
        toast.success("Employé mis à jour avec succès");
      } else {
        // Création d'un nouvel employé via le profil
        // Nous devons créer un UUID côté client pour éviter l'erreur
        const newId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: newId, // Utilisation d'un ID généré côté client
            full_name: employee.name,
            avatar_url: employee.photoUrl,
            role: employee.role,
            access_level: 1, // Valeur par défaut pour les nouveaux employés
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
        toast.success("Employé ajouté avec succès");
      }
      
      // Recharger les employés
      await fetchEmployees();
      setCurrentEmployee(undefined);
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      console.error("Erreur lors de la mise à jour de l'employé:", error);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setCurrentEmployee(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
        <Button onClick={handleAddClick}>
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

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredEmployees.length > 0 ? (
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
