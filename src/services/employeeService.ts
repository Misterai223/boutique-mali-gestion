
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";

export const employeeService = {
  // Récupérer tous les employés
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('full_name');

    if (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      throw error;
    }

    return data || [];
  },

  // Récupérer un employé par ID
  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de l\'employé:', error);
      throw error;
    }

    return data;
  },

  // Créer un nouvel employé
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      throw error;
    }

    return data;
  },

  // Mettre à jour un employé
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      throw error;
    }

    return data;
  },

  // Supprimer un employé (désactiver)
  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la désactivation de l\'employé:', error);
      throw error;
    }
  },

  // Récupérer les employés actifs
  async getActiveEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_active', true)
      .order('full_name');

    if (error) {
      console.error('Erreur lors de la récupération des employés actifs:', error);
      throw error;
    }

    return data || [];
  }
};
