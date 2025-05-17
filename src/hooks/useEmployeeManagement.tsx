
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

export const useEmployeeManagement = () => {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      
      // Reset state
      setCurrentEmployee(undefined);
      setDialogOpen(false);
      
      return true; // Indicate success
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      return false;
    }
  };

  const openAddEmployeeDialog = () => {
    setCurrentEmployee(undefined);
    setDialogOpen(true);
  };

  const openEditEmployeeDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setDialogOpen(true);
  };

  return {
    currentEmployee,
    dialogOpen,
    setDialogOpen,
    handleAddEditEmployee,
    openAddEmployeeDialog,
    openEditEmployeeDialog
  };
};
