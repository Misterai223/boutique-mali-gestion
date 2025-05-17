
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeForm from "@/components/employees/EmployeeForm";
import { Employee } from "@/types/employee";
import { Plus, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, employee: Employee | null }>({
    isOpen: false,
    employee: null
  });

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
          email: profile.email || '', // Ajout de l'email depuis le profil
          phone: profile.phone || '', // Ajout du numéro de téléphone
          role: profile.role,
          photoUrl: profile.avatar_url || undefined,
        }));
        
        setEmployees(mappedEmployees);
      } else {
        setEmployees([]);
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
  
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) => {
        const matchesSearch = 
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (employee.phone && employee.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          employee.role.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesRole = !roleFilter || employee.role === roleFilter;
        
        return matchesSearch && matchesRole;
      }
    );
  }, [employees, searchTerm, roleFilter]);

  const handleAddEditEmployee = async (employee: Employee) => {
    try {
      if (currentEmployee) {
        // Mettre à jour l'employé existant via le profil
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: employee.name,
            email: employee.email,
            phone: employee.phone,
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
            email: employee.email,
            phone: employee.phone,
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
  
  const handleDeleteClick = (employee: Employee) => {
    setConfirmDialog({
      isOpen: true,
      employee
    });
  };
  
  const handleDeleteConfirm = async () => {
    if (!confirmDialog.employee) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', confirmDialog.employee.id);
        
      if (error) throw error;
      
      toast.success(`Employé "${confirmDialog.employee.name}" supprimé avec succès`);
      await fetchEmployees();
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      console.error("Erreur lors de la suppression de l'employé:", error);
    } finally {
      setConfirmDialog({ isOpen: false, employee: null });
    }
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un employé par nom, email, téléphone ou rôle..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <div className="flex-shrink-0 w-full sm:w-48">
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les rôles</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
              <SelectItem value="manager">Gérant</SelectItem>
              <SelectItem value="cashier">Caissier</SelectItem>
              <SelectItem value="salesperson">Vendeur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || roleFilter) && (
          <Button variant="outline" onClick={resetFilters} className="flex-shrink-0">
            Réinitialiser
          </Button>
        )}
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
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-6 h-64">
          <div className="rounded-full bg-secondary w-12 h-12 flex items-center justify-center mb-4">
            <Filter className="h-6 w-6 text-secondary-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucun employé trouvé</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm || roleFilter 
              ? "Aucun employé ne correspond à vos critères de recherche." 
              : "Aucun employé n'a été ajouté pour le moment."
            }
          </p>
          {searchTerm || roleFilter ? (
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          )}
        </Card>
      )}

      <EmployeeForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={currentEmployee}
        onSave={handleAddEditEmployee}
      />
      
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, employee: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer cet employé ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cet employé sera définitivement supprimé 
              de notre système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Employees;
