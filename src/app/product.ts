import { Moment } from 'moment';

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
  extras: string[];
  color?: string;
  accept?: boolean;
  expiryDate?: Moment;
}

export interface ProductFromServer {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  rating: number;
  extras: string;
  color?: string;
  accept?: boolean;
  expiryDate?: string;
}

export interface ProductFilter {
  name: string;
  category: string;
}
