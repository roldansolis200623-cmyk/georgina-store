'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronLeft, LogOut, RefreshCw } from 'lucide-react';
import { Product } from '@/types';
import { useSupabaseProducts } from '@/lib/store/useSupabaseProducts';
import { useProductStore } from '@/lib/store/useProductStore';
import { Button } from '@/components/ui/Button';
import { StatsCards } from './StatsCards';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'list' | 'form';

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [view, setView] = useState<View>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, fetchProducts, isLoading } = useSupabaseProducts();
  const { logout } = useProductStore();

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, fetchProducts]);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setView('form');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setView('form');
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
    setView('list');
    fetchProducts();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-primary text-white px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {view === 'form' && (
                  <button
                    onClick={handleCloseForm}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="font-playfair text-xl font-bold">
                  {view === 'list' 
                    ? 'Panel Admin' 
                    : selectedProduct 
                      ? 'Editar Producto' 
                      : 'Nuevo Producto'
                  }
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {view === 'list' ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StatsCards products={products} />

                    <div className="flex flex-wrap gap-2 mb-6">
                      <Button onClick={handleAddNew} size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Producto
                      </Button>
                      <Button 
                        onClick={() => fetchProducts()} 
                        variant="outline" 
                        size="sm"
                        disabled={isLoading}
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualizar
                      </Button>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary mx-auto"></div>
                        <p className="text-grey mt-4">Cargando productos...</p>
                      </div>
                    ) : (
                      <ProductList products={products} onEdit={handleEdit} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ProductForm
                      product={selectedProduct}
                      onClose={handleCloseForm}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}