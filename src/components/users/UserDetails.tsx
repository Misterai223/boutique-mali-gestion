
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { userService } from "@/services/userService";
import { Profile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onEditUser: (profile: Profile) => void;
  onUserDeleted: () => void;
}

const UserDetails = ({ open, onOpenChange, profile, onEditUser, onUserDeleted }: UserDetailsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!profile) return null;
  
  const handleEdit = () => {
    onOpenChange(false);
    onEditUser(profile);
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteUser(profile.id);
      setIsDeleteDialogOpen(false);
      onOpenChange(false);
      onUserDeleted();
    } finally {
      setIsDeleting(false);
    }
  };
  
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Manager';
      case 'cashier': return 'Caissier';
      case 'salesperson': return 'Vendeur';
      default: return 'Utilisateur';
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-lg">{getInitials(profile.full_name)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-xl font-semibold">{profile.full_name || "Non défini"}</h3>
                <p className="text-sm text-muted-foreground">{getRoleName(profile.role)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID utilisateur</p>
                <p className="text-sm font-mono break-all">{profile.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                <p>{getRoleName(profile.role)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Niveau d'accès</p>
                <p>{profile.access_level}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créé le</p>
                <p>{getFormattedDate(profile.created_at)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dernière mise à jour</p>
                <p>{getFormattedDate(profile.updated_at)}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={handleEdit}>
              Modifier
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'utilisateur {profile.full_name} sera définitivement supprimé du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDetails;
