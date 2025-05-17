
import { useEffect, useState } from 'react';
import EmployeeCard from '@/components/employees/EmployeeCard';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import { UserPlus, Search, Filter } from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      // Transformer les données de profil en employés
      const employeeData: Employee[] = data.map((profile: Profile) => ({
        id: profile.id,
        name: profile.full_name || '',
        email: '', // Ces champs ne sont pas dans les profils, utiliser des valeurs par défaut
        phone: '', // Ces champs ne sont pas dans les profils, utiliser des valeurs par défaut
        role: profile.role,
        photoUrl: profile.avatar_url || ''
      }));
      
      setEmployees(employeeData);
    } catch (error: any) {
      toast.error(`Erreur lors du chargement des employés: ${error.message}`);
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter/modifier un employé
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

  // Fonction pour ouvrir le formulaire d'édition d'un employé
  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setDialogOpen(true);
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
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', employeeToDelete.id);
        
      if (error) throw error;
      
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Employés</h2>
        <Button onClick={() => {
          setCurrentEmployee(undefined);
          setDialogOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>
      
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
            <SelectItem value={undefined}>Tous les rôles</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="manager">Gérant</SelectItem>
            <SelectItem value="cashier">Caissier</SelectItem>
            <SelectItem value="salesperson">Vendeur</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              onEdit={handleEdit} 
              onDelete={handleDeleteConfirm} 
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
          <Button onClick={() => {
            setCurrentEmployee(undefined);
            setDialogOpen(true);
          }}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>
      )}

      {/* Formulaire pour ajouter/éditer un employé */}
      <EmployeeForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={currentEmployee}
        onSave={handleAddEditEmployee}
      />

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement l'employé {employeeToDelete?.name}.
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
    </div>
  );
};

export { Employees };
