
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Profile } from "@/types/profile";
import CreateUserForm from "./CreateUserForm";
import UpdateUserForm from "./UpdateUserForm";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Profile | null;
  onUserCreated?: () => void;
  onUserUpdated?: () => void;
}

const UserForm = ({ open, onOpenChange, initialData, onUserCreated, onUserUpdated }: UserFormProps) => {
  const isEditMode = !!initialData;
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>
        
        {isEditMode ? (
          <UpdateUserForm 
            initialData={initialData} 
            onUserUpdated={() => {
              onUserUpdated?.();
              onOpenChange(false);
            }}
            onCancel={handleCancel}
          />
        ) : (
          <CreateUserForm
            onUserCreated={() => {
              onUserCreated?.();
              onOpenChange(false);
            }}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
