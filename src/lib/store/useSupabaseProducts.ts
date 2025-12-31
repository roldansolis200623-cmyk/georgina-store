'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

interface SupabaseProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
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
      const { error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          category: productData.category,
          subcategory: productData.subcategory || null,
          price: productData.price,
          original_price: productData.originalPrice || null,
          description: productData.description || null,
          image: productData.image || null,
          images: productData.images || null,
          badge: productData.badge || null,
          stock: productData.stock || 10,
          sku: productData.sku || null,
          material: productData.material || null,
          dimensions: productData.dimensions || null,
          weight: productData.weight || null,
          color: productData.color || null,
          tags: productData.tags || null,
        }]);

      if (error) throw error;

      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          category: updates.category,
          subcategory: updates.subcategory || null,
          price: updates.price,
          original_price: updates.originalPrice || null,
          description: updates.description || null,
          image: updates.image || null,
          images: updates.images || null,
          badge: updates.badge || null,
          stock: updates.stock,
          sku: updates.sku || null,
          material: updates.material || null,
          dimensions: updates.dimensions || null,
          weight: updates.weight || null,
          color: updates.color || null,
          tags: updates.tags || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchProducts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
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
      throw error;
    }
  },
}));