
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/userService";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

export const useUserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  
  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Chargement des profils...");
      const data = await userService.getProfiles();
      console.log("Profils chargés:", data);
      setProfiles(data);
      // Appliquer immédiatement le filtrage après chargement
      applyFilters(data, searchTerm, roleFilter);
    } catch (error) {
      console.error("Erreur lors du chargement des profils:", error);
      toast.error("Erreur lors du chargement des profils");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Fonction séparée pour appliquer les filtres
  const applyFilters = useCallback((data: Profile[], search: string, role: string) => {
    let result = [...data];
    
    // Appliquer la recherche textuelle
    if (search) {
      result = result.filter(profile => 
        profile.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        profile.role.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Appliquer le filtre de rôle
    if (role && role !== "all") {
      result = result.filter(profile => profile.role === role);
    }
    
    setFilteredProfiles(result);
  }, []);

  // Appliquer les filtres quand les filtres ou les données changent
  useEffect(() => {
    applyFilters(profiles, searchTerm, roleFilter);
  }, [searchTerm, roleFilter, profiles, applyFilters]);

  const handleAddEdit = useCallback(() => {
    setCurrentProfile(null);
    setFormOpen(true);
  }, []);

  const handleViewDetails = useCallback((profile: Profile) => {
    setCurrentProfile(profile);
    setDetailOpen(true);
  }, []);

  const handleEditUser = useCallback((profile: Profile) => {
    setCurrentProfile(profile);
    setFormOpen(true);
  }, []);

  const handleUserCreated = useCallback(async () => {
    setFormOpen(false);
    await loadProfiles();
    toast.success("Utilisateur ajouté avec succès");
  }, [loadProfiles]);

  const handleUserUpdated = useCallback(async () => {
    setFormOpen(false);
    await loadProfiles();
    toast.success("Utilisateur mis à jour avec succès");
  }, [loadProfiles]);

  const handleUserDeleted = useCallback(async () => {
    setDetailOpen(false);
    await loadProfiles();
    toast.success("Utilisateur supprimé avec succès");
  }, [loadProfiles]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setRoleFilter("");
  }, []);

  return {
    profiles,
    filteredProfiles,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    isLoading,
    formOpen,
    setFormOpen,
    detailOpen,
    setDetailOpen,
    currentProfile,
    setCurrentProfile,
    loadProfiles,
    handleAddEdit,
    handleViewDetails,
    handleEditUser,
    handleUserCreated,
    handleUserUpdated,
    handleUserDeleted,
    handleResetFilters
  };
};
