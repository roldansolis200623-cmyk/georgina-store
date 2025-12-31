'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: typeof favorites[0]) => {
    addItem(product);
    showToast('Agregado al carrito', 'success');
  };

  const handleRemove = (productId: number) => {
    removeFavorite(productId);
    showToast('Eliminado de favoritos', 'success');
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                <h2 className="font-bold text-lg">Favoritos ({favorites.length})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-grey mb-4">No tienes favoritos aún</p>
                  <Link
                    href="/tienda"
                    onClick={onClose}
                    className="text-secondary hover:underline"
                  >
                    Explorar tienda
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Heart className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-primary text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-secondary font-bold mt-1">
                          {formatPrice(product.price)}
                        </p>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1 px-3 py-1 bg-secondary text-white text-xs rounded-full hover:bg-accent transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Agregar
                          </button>
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    clearFavorites();
                    showToast('Favoritos eliminados', 'success');
                  }}
                  className="w-full py-2 text-red-500 text-sm hover:bg-red-50 rounded-lg transition-colors"
                >
                  Limpiar favoritos
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}