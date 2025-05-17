
  const handleAddEditEmployee = async (employee: Employee) => {
    try {
      if (currentEmployee) {
        // Mettre à jour l'employé existant via le profil
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: employee.name,
            avatar_url: employee.photoUrl,
            role: employee.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', employee.id);
          
        if (error) throw error;
        
        toast.success("Employé mis à jour avec succès");
      } else {
        // Création d'un nouvel employé via le profil
        // Nous devons créer un UUID côté client pour éviter l'erreur
        const newId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: newId, // Utilisation d'un ID généré côté client
            full_name: employee.name,
            avatar_url: employee.photoUrl,
            role: employee.role,
            access_level: 1, // Valeur par défaut pour les nouveaux employés
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
        toast.success("Employé ajouté avec succès");
      }
      
      // Recharger les employés
      await fetchEmployees();
      setCurrentEmployee(undefined);
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      console.error("Erreur lors de la mise à jour de l'employé:", error);
    }
  };
