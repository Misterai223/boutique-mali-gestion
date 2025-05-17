
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
    console.log("UserForm: annulation, fermeture du formulaire");
    onOpenChange(false);
  };

  const handleUserCreated = () => {
    console.log("UserForm: utilisateur créé, appel du callback onUserCreated");
    
    if (onUserCreated) {
      onUserCreated();
    } else {
      console.warn("UserForm: callback onUserCreated non fourni");
    }
  };

  const handleUserUpdated = () => {
    console.log("UserForm: utilisateur mis à jour, appel du callback onUserUpdated");
    
    if (onUserUpdated) {
      onUserUpdated();
    } else {
      console.warn("UserForm: callback onUserUpdated non fourni");
    }
  };

  console.log("UserForm rendu:", {
    isEditMode,
    hasInitialData: !!initialData,
    onUserCreatedProvided: !!onUserCreated,
    onUserUpdatedProvided: !!onUserUpdated
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modifiez les informations de l'utilisateur ci-dessous." 
              : "Remplissez le formulaire pour créer un nouvel utilisateur."}
          </DialogDescription>
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
