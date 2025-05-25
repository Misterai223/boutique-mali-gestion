
import { Employee } from '@/types/employee';

const STORAGE_KEY = 'employees_data';

// Helper function to generate UUID
const generateId = () => {
  return 'emp_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Helper function to get employees from localStorage
const getStoredEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des employés:', error);
    return [];
  }
};

// Helper function to save employees to localStorage
const saveEmployees = (employees: Employee[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des employés:', error);
    return false;
  }
};

export const employeeService = {
  // Récupérer tous les employés
  async getEmployees(): Promise<Employee[]> {
    try {
      return getStoredEmployees();
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      return [];
    }
  },

  // Créer un nouvel employé
  async createEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee | null> {
    try {
      const employees = getStoredEmployees();
      const now = new Date().toISOString();
      
      const newEmployee: Employee = {
        ...employeeData,
        id: generateId(),
        created_at: now,
        updated_at: now
      };

      employees.push(newEmployee);
      
      if (saveEmployees(employees)) {
        return newEmployee;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      return null;
    }
  },

  // Mettre à jour un employé
  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
      const employees = getStoredEmployees();
      const employeeIndex = employees.findIndex(emp => emp.id === id);
      
      if (employeeIndex === -1) {
        return null;
      }

      const updatedEmployee: Employee = {
        ...employees[employeeIndex],
        ...employeeData,
        updated_at: new Date().toISOString()
      };

      employees[employeeIndex] = updatedEmployee;
      
      if (saveEmployees(employees)) {
        return updatedEmployee;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      return null;
    }
  },

  // Supprimer un employé
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const employees = getStoredEmployees();
      const filteredEmployees = employees.filter(emp => emp.id !== id);
      
      return saveEmployees(filteredEmployees);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      return false;
    }
  }
};
