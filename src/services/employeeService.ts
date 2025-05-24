
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';

export const employeeService = {
  // Récupérer tous les employés
  async getEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      return [];
    }
  },

  // Créer un nouvel employé
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          ...employeeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      return null;
    }
  },

  // Mettre à jour un employé
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({
          ...employeeData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      return null;
    }
  },

  // Supprimer un employé
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      return false;
    }
  }
};
