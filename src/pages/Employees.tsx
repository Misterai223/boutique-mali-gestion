
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeList from '@/components/employees/EmployeeList';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';
import { useIsMobile } from '@/hooks/use-mobile';

export const Employees = () => {
  const isMobile = useIsMobile();
  
  const {
    currentEmployee,
    dialogOpen,
    setDialogOpen,
    handleAddEditEmployee,
    openAddEmployeeDialog,
    openEditEmployeeDialog
  } = useEmployeeManagement();

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
        <p><strong>Note :</strong> Les employés sont des personnes qui travaillent dans votre entreprise. Ils peuvent avoir ou non un compte utilisateur dans le système.</p>
        <p className="mt-2">Un <strong>utilisateur</strong> est une personne qui a un compte dans le système et peut se connecter. Tous les utilisateurs ne sont pas nécessairement des employés de votre entreprise.</p>
      </div>
      
      <EmployeeList 
        onAddEmployee={openAddEmployeeDialog}
        onEditEmployee={openEditEmployeeDialog}
      />

      {/* Formulaire pour ajouter/éditer un employé */}
      <EmployeeForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={currentEmployee}
        onSave={handleAddEditEmployee}
      />
    </div>
  );
};
