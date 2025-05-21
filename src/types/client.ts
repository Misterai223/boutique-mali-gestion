
import { Product } from "./product";

export interface PurchasedProduct {
  product: Product;
  quantity: number;
}

export interface Client {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  email: string;
  purchases: PurchasedProduct[];
  createdAt: string;
  updatedAt: string;
}
