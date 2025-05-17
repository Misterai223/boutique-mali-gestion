
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyUserStateProps {
  hasFilters: boolean;
  onAddUser: () => void;
  onResetFilters: () => void;
}

const EmptyUserState = ({ hasFilters, onAddUser, onResetFilters }: EmptyUserStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
      <p className="text-lg text-muted-foreground">Aucun utilisateur trouvé</p>
      {hasFilters ? (
        <Button 
          variant="link" 
          onClick={onResetFilters}
        >
          Réinitialiser les filtres
        </Button>
      ) : (
        <Button 
          variant="secondary"
          onClick={onAddUser}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter votre premier utilisateur
        </Button>
      )}
    </div>
  );
};

export default EmptyUserState;
