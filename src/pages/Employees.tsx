
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeList from '@/components/employees/EmployeeList';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export const Employees = () => {
  const isMobile = useIsMobile();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    currentEmployee,
    dialogOpen,
    setDialogOpen,
    handleAddEditEmployee,
    openAddEmployeeDialog,
    openEditEmployeeDialog
  } = useEmployeeManagement();

  const handleSave = async (employeeData: any) => {
    const success = await handleAddEditEmployee(employeeData);
    if (success) {
      // Trigger refresh by incrementing the trigger
      setRefreshTrigger(prev => prev + 1);
    }
    return success;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Employés</h2>
        <Button onClick={openAddEmployeeDialog} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          {isMobile ? "Ajouter" : "Ajouter un employé"}
        </Button>
      </div>
      
      <div className="bg-muted/40 rounded-lg p-3 sm:p-4 border text-sm">
        <p><strong>Gestion des employés :</strong> Cette section permet de gérer les informations des employés de votre entreprise (nom, contact, rôle dans l'entreprise).</p>
        <p className="mt-2"><strong>Important :</strong> Cette page est distincte de la gestion des utilisateurs qui ont accès à l'application.</p>
      </div>
      
      <EmployeeList 
        onEditEmployee={openEditEmployeeDialog}
        refreshTrigger={refreshTrigger}
      />

      {/* Formulaire pour ajouter/éditer un employé */}
      <EmployeeForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={currentEmployee}
        onSave={handleSave}
      />
    </div>
  );
};
