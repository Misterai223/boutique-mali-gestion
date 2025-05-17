
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface LogoGalleryProps {
  logoUrls: string[];
  currentLogo: string | null;
  onSelectLogo: (url: string) => void;
  onDeleteLogo: (url: string) => void;
  isLoading: boolean;
}

const LogoGallery = ({ 
  logoUrls, 
  currentLogo, 
  onSelectLogo, 
  onDeleteLogo, 
  isLoading 
}: LogoGalleryProps) => {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (url: string) => {
    setSelectedLogo(url);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLogo) return;
    
    onDeleteLogo(selectedLogo);
    setDeleteDialogOpen(false);
    setSelectedLogo(null);
  };

  // Utility function for conditional class names
  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Logos disponibles</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : logoUrls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {logoUrls.map((url, index) => (
              <div
                key={index}
                className={cn(
                  "border rounded-md p-4 relative group",
                  currentLogo === url ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                )}
              >
                <div className="aspect-square flex items-center justify-center">
                  <img
                    src={url}
                    alt={`Logo ${index + 1}`}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => onSelectLogo(url)}
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onSelectLogo(url)}
                  >
                    Utiliser
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {currentLogo === url && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Actuel
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">Aucun logo disponible</p>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce logo ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le logo sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoGallery;
