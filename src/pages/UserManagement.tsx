
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, UserCog, Search, Filter, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserTable from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import UserDetails from "@/components/users/UserDetails";
import { useUserManagement } from "@/hooks/useUserManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const UserManagement = () => {
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
    setCurrentProfile,
    handleAddEdit,
    handleViewDetails,
    handleEditUser,
    handleUserCreated,
    handleUserUpdated,
    handleUserDeleted,
    handleResetFilters
  } = useUserManagement();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const headerVariants = {
    initial: { y: -30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  const searchVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        variants={headerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold tracking-tight flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <UserCog className="h-8 w-8 text-blue-500" />
          </motion.div>
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Gestion des utilisateurs
          </motion.span>
        </motion.h1>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            onClick={handleAddEdit} 
            className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Plus className="h-4 w-4 mr-2" />
            </motion.div>
            Ajouter un utilisateur
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4"
        variants={searchVariants}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur par nom ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 shadow-sm border-input/60 focus-visible:ring-blue-500/30"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par rôle" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="admin">Administrateurs</SelectItem>
            <SelectItem value="manager">Managers</SelectItem>
            <SelectItem value="cashier">Caissiers</SelectItem>
            <SelectItem value="salesperson">Vendeurs</SelectItem>
            <SelectItem value="user">Utilisateurs</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <ScrollArea className="h-[calc(100vh-220px)] w-full pr-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-md border">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProfiles.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <UserTable 
              profiles={filteredProfiles} 
              onViewDetails={handleViewDetails} 
              onEditUser={handleEditUser} 
            />
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-muted/30 rounded-lg border border-dashed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.3
              }}
            >
              <ShieldCheck className="h-16 w-16 mx-auto text-muted-foreground/60" />
            </motion.div>
            <motion.p 
              className="text-muted-foreground mt-4 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Aucun utilisateur trouvé
            </motion.p>
            {(searchTerm || roleFilter) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={handleResetFilters} 
                  variant="link" 
                  className="mt-2"
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </ScrollArea>

      {/* Formulaire d'ajout/modification d'utilisateur */}
      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={currentProfile}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
      />

      {/* Détails de l'utilisateur */}
      <UserDetails
        open={detailOpen}
        onOpenChange={setDetailOpen}
        profile={currentProfile}
        onEditUser={handleEditUser}
        onUserDeleted={handleUserDeleted}
      />
    </motion.div>
  );
};

export default UserManagement;
