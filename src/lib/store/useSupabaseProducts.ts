'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

interface SupabaseProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useSupabaseProducts = create<SupabaseProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        originalPrice: p.original_price,
        description: p.description,
        image: p.image,
        images: p.images,
        badge: p.badge,
        stock: p.stock,
        sku: p.sku,
        material: p.material,
        dimensions: p.dimensions,
        weight: p.weight,
        color: p.color,
        tags: p.tags,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      set({ products, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          category: productData.category,
          subcategory: productData.subcategory,
          price: productData.price,
          original_price: productData.originalPrice,
          description: productData.description,
          image: productData.image,
          images: productData.images,
          badge: productData.badge,
          stock: productData.stock,
          sku: productData.sku,
          material: productData.material,
          dimensions: productData.dimensions,
          weight: productData.weight,
          color: productData.color,
          tags: productData.tags,
        }])
        .select()
        .single();

      if (error) throw error;

      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          category: updates.category,
          subcategory: updates.subcategory,
          price: updates.price,
          original_price: updates.originalPrice,
          description: updates.description,
          image: updates.image,
          images: updates.images,
          badge: updates.badge,
          stock: updates.stock,
          sku: updates.sku,
          material: updates.material,
          dimensions: updates.dimensions,
          weight: updates.weight,
          color: updates.color,
          tags: updates.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));