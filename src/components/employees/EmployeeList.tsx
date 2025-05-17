
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { Profile } from '@/types/profile';
import EmployeeCard from './EmployeeCard';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployeeSearchFilter from './EmployeeSearchFilter';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface EmployeeListProps {
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
}

const EmployeeList = ({ onAddEmployee, onEditEmployee }: EmployeeListProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effectue le chargement initial des employés
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fonction pour récupérer les employés depuis Supabase
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // Pour l'instant, nous utilisons les profils comme source d'employés
      // Mais nous marquons clairement qu'ils sont aussi des utilisateurs
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      // Transformer les données de profil en employés
      const employeeData: Employee[] = data.map((profile: Profile) => ({
        id: profile.id,
        name: profile.full_name || '',
        email: '', // Ces champs ne sont pas dans les profils
        phone: '', // Ces champs ne sont pas dans les profils
        role: profile.role,
        photoUrl: profile.avatar_url || '',
        isUser: true,  // Ces employés sont aussi des utilisateurs
        userId: profile.id // Référence à l'ID utilisateur
      }));
      
      setEmployees(employeeData);
    } catch (error: any) {
      toast.error(`Erreur lors du chargement des employés: ${error.message}`);
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour confirmer la suppression d'un employé
  const handleDeleteConfirm = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  // Fonction pour supprimer un employé
  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      if (employeeToDelete.isUser && employeeToDelete.userId) {
        // Si l'employé est aussi un utilisateur, supprimer le profil
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', employeeToDelete.userId);
          
        if (error) throw error;
      } else {
        // Dans le futur, nous pourrions avoir une table dédiée pour les employés non-utilisateurs
        console.log("Suppression d'un employé qui n'est pas un utilisateur", employeeToDelete);
      }
      
      // Mettre à jour l'état local
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      toast.success(`Employé "${employeeToDelete.name}" supprimé avec succès`);
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      console.error("Erreur lors de la suppression de l'employé:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Filtrer les employés en fonction de la recherche et du filtre de rôle
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || employee.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <EmployeeSearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee} 
              onEdit={() => onEditEmployee(employee)} 
              onDelete={() => handleDeleteConfirm(employee)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-8">
          <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun employé trouvé</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm || roleFilter ? "Essayez de modifier vos filtres." : "Ajoutez votre premier employé pour commencer."}
          </p>
          <Button onClick={onAddEmployee}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>
      )}

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement l'employé {employeeToDelete?.name}.
              {employeeToDelete?.isUser && " Cela supprimera également son profil utilisateur."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmployeeList;
