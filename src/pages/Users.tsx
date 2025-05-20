
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUserManagement } from "@/hooks/useUserManagement";
import UserForm from "@/components/users/UserForm";
import UserDetails from "@/components/users/UserDetails";
import UserTable from "@/components/users/UserTable";
import UserSearchAndFilter from "@/components/users/UserSearchAndFilter";
import EmptyUserState from "@/components/users/EmptyUserState";

const Users = () => {
  const {
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
    handleAddEdit,
    handleViewDetails,
    handleEditUser,
    handleUserCreated,
    handleUserUpdated,
    handleUserDeleted,
    handleResetFilters
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <Button onClick={handleAddEdit}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <UserSearchAndFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <UserTable 
          profiles={filteredProfiles} 
          onViewDetails={handleViewDetails} 
          onEditUser={handleEditUser} 
        />
      ) : (
        <EmptyUserState 
          hasFilters={!!(searchTerm || roleFilter)} 
          onAddUser={handleAddEdit} 
          onResetFilters={handleResetFilters} 
        />
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
