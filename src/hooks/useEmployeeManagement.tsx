
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
        // Mettre à jour l'employé existant
        if (employee.isUser && employee.userId) {
          // Si l'employé est lié à un utilisateur, mettre à jour le profil utilisateur également
          const { error } = await supabase
            .from('profiles')
            .update({
              full_name: employee.name,
              avatar_url: employee.photoUrl,
              role: employee.role,
              updated_at: new Date().toISOString()
            })
            .eq('id', employee.userId);
            
          if (error) throw error;
        } else {
          // Dans le futur, nous pourrions avoir une table dédiée pour les employés non-utilisateurs
          // Pour l'instant, nous simulons la mise à jour
          console.log("Mise à jour d'un employé qui n'est pas un utilisateur", employee);
        }
        
        toast.success("Employé mis à jour avec succès");
      } else {
        // Création d'un nouvel employé
        if (employee.isUser) {
          // Créer un profil utilisateur pour cet employé
          const newId = crypto.randomUUID();
          
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: newId,
              full_name: employee.name,
              avatar_url: employee.photoUrl,
              role: employee.role,
              access_level: 1, 
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (error) throw error;
          
          // Mettre à jour l'ID de l'employé avec l'ID du profil créé
          employee.userId = newId;
        } else {
          // Dans le futur, nous pourrions avoir une table dédiée pour les employés non-utilisateurs
          // Pour l'instant, nous simulons la création
          console.log("Création d'un employé qui n'est pas un utilisateur", employee);
        }
        
        toast.success("Employé ajouté avec succès");
      }
      
      // Reset state
      setCurrentEmployee(undefined);
      setDialogOpen(false);
      
      return true;
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
