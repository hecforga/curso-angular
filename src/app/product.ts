export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  rating: number;
}

export interface ProductFilter {
  name: string;
  category: string;
}
