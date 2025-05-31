
import { supabase } from "@/integrations/supabase/client";
import { Product, CreateProductData, UpdateProductData } from "@/types/product";

export const productService = {
  // Récupérer tous les produits avec leurs catégories
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name)
      `)
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }

    return data || [];
  },

  // Récupérer un produit par ID
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }

    return data;
  },

  // Créer un nouveau produit
  async createProduct(productData: CreateProductData): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }

    return data;
  },

  // Mettre à jour un produit
  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }

    return data;
  },

  // Supprimer un produit
  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  },

  // Mettre à jour le stock d'un produit
  async updateStock(id: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      throw error;
    }
  },

  // Récupérer les produits en rupture de stock
  async getLowStockProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .where('stock_quantity', 'lte', 'threshold')
      .eq('is_active', true);

    if (error) {
      console.error('Erreur lors de la récupération des produits en rupture:', error);
      throw error;
    }

    return data || [];
  }
};
