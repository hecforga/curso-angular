export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  inventoryStatus: string;
  category: string;
  image: string;
  rating: number;
}

export interface ProductFilter {
  name: string;
  inventoryStatus: string;
}
