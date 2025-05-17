
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
        <Button onClick={openAddEmployeeDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
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
