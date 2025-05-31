
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  threshold: number;
  category_id: string | null;
  image_url: string | null;
  sku: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export type CreateProductData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductData = Partial<CreateProductData>;
