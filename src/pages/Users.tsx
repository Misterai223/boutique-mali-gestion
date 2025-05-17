
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profile } from "@/types/profile";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import UserForm from "@/components/users/UserForm";
import UserDetails from "@/components/users/UserDetails";

const Users = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, roleFilter, profiles]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      console.log("Chargement des profils...");
      const data = await userService.getProfiles();
      console.log("Profils chargés:", data);
      setProfiles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des profils:", error);
      toast.error("Erreur lors du chargement des profils");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...profiles];
    
    // Appliquer la recherche textuelle
    if (searchTerm) {
      result = result.filter(profile => 
        profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Appliquer le filtre de rôle
    if (roleFilter && roleFilter !== "all") {
      result = result.filter(profile => profile.role === roleFilter);
    }
    
    setFilteredProfiles(result);
  };

  const handleAddEdit = () => {
    setCurrentProfile(null);
    setFormOpen(true);
  };

  const handleViewDetails = (profile: Profile) => {
    setCurrentProfile(profile);
    setDetailOpen(true);
  };

  const handleEditUser = (profile: Profile) => {
    setCurrentProfile(profile);
    setFormOpen(true);
  };

  const handleUserCreated = async () => {
    setFormOpen(false);
    await loadProfiles();
    toast.success("Utilisateur ajouté avec succès");
  };

  const handleUserUpdated = async () => {
    setFormOpen(false);
    await loadProfiles();
    toast.success("Utilisateur mis à jour avec succès");
  };

  const handleUserDeleted = async () => {
    setDetailOpen(false);
    await loadProfiles();
    toast.success("Utilisateur supprimé avec succès");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 hover:bg-red-600';
      case 'manager': return 'bg-blue-500 hover:bg-blue-600';
      case 'cashier': return 'bg-green-500 hover:bg-green-600';
      case 'salesperson': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <Button onClick={handleAddEdit}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex-shrink-0 w-full md:w-[180px]">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filtrer par rôle" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Caissier</SelectItem>
              <SelectItem value="salesperson">Vendeur</SelectItem>
              <SelectItem value="user">Utilisateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Niveau d'accès</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id} className="hover:cursor-pointer" onClick={() => handleViewDetails(profile)}>
                  <TableCell className="font-medium">{profile.full_name || "Non défini"}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(profile.role)}>
                      {profile.role === 'admin' && 'Administrateur'}
                      {profile.role === 'manager' && 'Manager'}
                      {profile.role === 'cashier' && 'Caissier'}
                      {profile.role === 'salesperson' && 'Vendeur'}
                      {profile.role === 'user' && 'Utilisateur'}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.access_level}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(profile);
                      }}
                    >
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
          <p className="text-lg text-muted-foreground">Aucun utilisateur trouvé</p>
          {searchTerm || roleFilter ? (
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("");
              }}
            >
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button 
              variant="secondary"
              onClick={handleAddEdit}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre premier utilisateur
            </Button>
          )}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      <UserForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        initialData={currentProfile}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
      />

      {/* Détails utilisateur */}
      <UserDetails
        open={detailOpen}
        onOpenChange={setDetailOpen}
        profile={currentProfile}
        onEditUser={handleEditUser}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
};

export default Users;
