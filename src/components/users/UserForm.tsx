
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

  const handleUserCreated = () => {
    console.log("UserForm: utilisateur créé, appel du callback onUserCreated");
    if (onUserCreated) {
      onUserCreated();
    }
  };

  const handleUserUpdated = () => {
    console.log("UserForm: utilisateur mis à jour, appel du callback onUserUpdated");
    if (onUserUpdated) {
      onUserUpdated();
    }
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
            onUserUpdated={handleUserUpdated}
            onCancel={handleCancel}
          />
        ) : (
          <CreateUserForm
            onUserCreated={handleUserCreated}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
