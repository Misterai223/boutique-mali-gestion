
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeList from '@/components/employees/EmployeeList';
import { useEmployeeManagement } from '@/hooks/useEmployeeManagement';

export const Employees = () => {
  const {
    currentEmployee,
    dialogOpen,
    setDialogOpen,
    handleAddEditEmployee,
    openAddEmployeeDialog,
    openEditEmployeeDialog
  } = useEmployeeManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Employés</h2>
        <div className="flex gap-2">
          <Button onClick={openAddEmployeeDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un employé
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/40 rounded-lg p-4 border text-sm">
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
