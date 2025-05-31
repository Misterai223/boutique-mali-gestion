
import { supabase } from "@/integrations/supabase/client";
import { Category, CreateCategoryData, UpdateCategoryData } from "@/types/category";

export const categoryService = {
  // Récupérer toutes les catégories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }

    return data || [];
  },

  // Récupérer une catégorie par ID
  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      throw error;
    }

    return data;
  },

  // Créer une nouvelle catégorie
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }

    return data;
  },

  // Mettre à jour une catégorie
  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      throw error;
    }

    return data;
  },

  // Supprimer une catégorie
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }
};
