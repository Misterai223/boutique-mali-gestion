
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsService } from "@/services/settingsService";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LogoSettings = () => {
  const [logoUrls, setLogoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  useEffect(() => {
    fetchLogos();
    // Récupérer le logo actuel du localStorage
    const storedLogo = localStorage.getItem("shopLogo");
    if (storedLogo) {
      setCurrentLogo(storedLogo);
    }
  }, []);

  const fetchLogos = async () => {
    setIsLoading(true);
    try {
      const urls = await settingsService.getLogos();
      setLogoUrls(urls);
    } catch (error) {
      console.error("Erreur lors de la récupération des logos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Vérifier le type de fichier
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
      toast.error("Format de fichier non supporté. Utilisez JPG, PNG, GIF ou SVG.");
      return;
    }
    
    // Vérifier la taille (maximum 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en octets
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux. Maximum 5MB.");
      return;
    }
    
    setIsUploading(true);
    try {
      const url = await settingsService.uploadLogo(file);
      if (url) {
        toast.success("Logo téléchargé avec succès");
        setLogoUrls([url, ...logoUrls]);
        // Définir comme logo actuel
        handleSelectLogo(url);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    } finally {
      setIsUploading(false);
      // Réinitialiser l'input de fichier
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelectLogo = (url: string) => {
    setCurrentLogo(url);
    localStorage.setItem("shopLogo", url);
    toast.success("Logo défini comme logo actuel");
  };

  const handleDeleteClick = (url: string) => {
    setSelectedLogo(url);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLogo) return;
    
    try {
      const success = await settingsService.deleteLogoByUrl(selectedLogo);
      if (success) {
        setLogoUrls(logoUrls.filter(url => url !== selectedLogo));
        // Si le logo supprimé est le logo actuel, réinitialiser
        if (selectedLogo === currentLogo) {
          localStorage.removeItem("shopLogo");
          setCurrentLogo(null);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedLogo(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Logo de la boutique</CardTitle>
          <CardDescription>
            Téléchargez et gérez le logo de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Téléchargement..." : "Télécharger un logo"}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/svg+xml"
              className="hidden"
            />
            
            {currentLogo && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Logo actuel</h3>
                <div className="border rounded-md p-4 bg-muted/30 flex items-center justify-center">
                  <img
                    src={currentLogo}
                    alt="Logo actuel"
                    className="max-h-32 max-w-full"
                  />
                </div>
              </div>
            )}

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
                          onClick={() => handleSelectLogo(url)}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSelectLogo(url)}
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
          </div>
        </CardContent>
      </Card>

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

// Fonction utilitaire pour les classes conditionnelles
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default LogoSettings;
