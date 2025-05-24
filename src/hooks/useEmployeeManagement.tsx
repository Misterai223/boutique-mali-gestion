
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { employeeService } from '@/services/employeeService';
import { toast } from 'sonner';

export const useEmployeeManagement = () => {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fonction pour ajouter/modifier un employé
  const handleAddEditEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'> | Employee) => {
    try {
      if (currentEmployee) {
        // Mettre à jour l'employé existant
        const result = await employeeService.updateEmployee(currentEmployee.id, employee);
        
        if (result) {
          toast.success("Employé mis à jour avec succès");
        } else {
          toast.error("Erreur lors de la mise à jour de l'employé");
          return false;
        }
      } else {
        // Création d'un nouvel employé
        const result = await employeeService.createEmployee(employee as Omit<Employee, 'id' | 'created_at' | 'updated_at'>);
        
        if (result) {
          toast.success("Employé ajouté avec succès");
        } else {
          toast.error("Erreur lors de l'ajout de l'employé");
          return false;
        }
      }
      
      // Reset state
      setCurrentEmployee(undefined);
      setDialogOpen(false);
      
      return true;
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      console.error("Erreur lors de la gestion de l'employé:", error);
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
