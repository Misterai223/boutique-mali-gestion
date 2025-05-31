
import { supabase } from "@/integrations/supabase/client";
import { Employee, CreateEmployeeData, UpdateEmployeeData } from "@/types/employee";

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

    // Map database fields to interface fields
    return (data || []).map(emp => ({
      id: emp.id,
      full_name: emp.full_name,
      email: emp.email,
      phone: emp.phone,
      role: emp.position, // Map position to role
      photo_url: undefined, // Not in database yet
      created_at: emp.created_at,
      updated_at: emp.updated_at
    }));
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

    if (!data) return null;

    // Map database fields to interface fields
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.position, // Map position to role
      photo_url: undefined, // Not in database yet
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Créer un nouvel employé
  async createEmployee(employeeData: CreateEmployeeData): Promise<Employee> {
    const dbData = {
      full_name: employeeData.full_name,
      email: employeeData.email,
      phone: employeeData.phone,
      position: employeeData.role, // Map role to position for database
    };

    const { data, error } = await supabase
      .from('employees')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      throw error;
    }

    // Map database fields back to interface fields
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.position, // Map position to role
      photo_url: undefined, // Not in database yet
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Mettre à jour un employé
  async updateEmployee(id: string, employeeData: UpdateEmployeeData): Promise<Employee> {
    const dbData: any = {};
    
    if (employeeData.full_name !== undefined) dbData.full_name = employeeData.full_name;
    if (employeeData.email !== undefined) dbData.email = employeeData.email;
    if (employeeData.phone !== undefined) dbData.phone = employeeData.phone;
    if (employeeData.role !== undefined) dbData.position = employeeData.role; // Map role to position

    const { data, error } = await supabase
      .from('employees')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      throw error;
    }

    // Map database fields back to interface fields
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.position, // Map position to role
      photo_url: undefined, // Not in database yet
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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

    // Map database fields to interface fields
    return (data || []).map(emp => ({
      id: emp.id,
      full_name: emp.full_name,
      email: emp.email,
      phone: emp.phone,
      role: emp.position, // Map position to role
      photo_url: undefined, // Not in database yet
      created_at: emp.created_at,
      updated_at: emp.updated_at
    }));
  }
};
