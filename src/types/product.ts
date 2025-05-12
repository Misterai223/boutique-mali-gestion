
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  threshold: number;
  description?: string;
  imageUrl?: string;
}
