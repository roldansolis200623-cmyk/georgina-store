export type Category = 'decoracion' | 'muebles' | 'lashroom';

export type Badge = 'nuevo' | 'bestseller' | 'exclusivo' | 'oferta' | null;

export interface Product {
  id: number;
  name: string;
  category: Category;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  hasOffer?: boolean;
  description: string;
  badge?: Badge;
  image?: string;
  images?: string[];
  stock: number | null;
  color?: string;
  createdAt: string;
  updatedAt: string;
  sku?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  tags?: string[];
}

export interface DeletedProduct extends Product {
  deletedAt: string;
}

export interface ProductFormData {
  name: string;
  category: Category;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  description: string;
  hasOffer: boolean;
  badge?: Badge;
  stock: number | null;
  image?: string;
  images?: string[];
  color?: string;
  sku?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  tags?: string[];
}

export type SortCriteria = 
  | 'name-asc' 
  | 'name-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'date-asc' 
  | 'date-desc';

export interface Session {
  timestamp: number;
  expiresAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface CategoryConfig {
  value: Category;
  label: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryConfig[] = [
  { 
    value: 'decoracion', 
    label: 'Decoración',
    subcategories: ['Letras Retroiluminadas']
  },
  { 
    value: 'muebles', 
    label: 'Muebles',
    subcategories: ['Sofás', 'Sitiales', 'Comedores', 'Rack Tv']
  },
  { 
    value: 'lashroom', 
    label: 'Lashroom',
    subcategories: ['Camillas', 'Lámparas', 'Accesorios']
  },
];