
export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type CreateCategoryData = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCategoryData = Partial<CreateCategoryData>;
