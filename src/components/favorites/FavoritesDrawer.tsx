'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/formatters';
import { useToast } from '@/components/ui/Toast';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const { favorites, removeFavorite, clearFavorites, getFavoritesCount } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: typeof favorites[0]) => {
    addItem(product);
    showToast('Agregado al carrito', 'success');
  };

  const handleRemove = (productId: number) => {
    removeFavorite(productId);
    showToast('Eliminado de favoritos', 'info');
  };

  const totalItems = mounted ? getFavoritesCount() : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-dark shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-light-grey dark:border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-playfair text-xl font-bold text-primary dark:text-white">
                    Mis Favoritos
                  </h2>
                  <p className="text-sm text-grey dark:text-gray-400">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-light-grey dark:hover:bg-dark-card rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-grey" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-light-grey dark:bg-dark-card rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-12 h-12 text-grey" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-primary dark:text-white mb-2">
                    Sin favoritos
                  </h3>
                  <p className="text-grey dark:text-gray-400 mb-6">
                    Guarda tus productos favoritos aqui
                  </p>
                  <Button onClick={onClose} variant="secondary">
                    Ver Catalogo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-cream/50 dark:bg-dark-card rounded-xl p-3"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-light-grey dark:bg-dark-border">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-grey" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary dark:text-white truncate">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-secondary">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-grey line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-white text-sm rounded-full hover:bg-accent transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Agregar
                          </button>
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="p-1.5 text-grey hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="border-t border-light-grey dark:border-dark-border p-4 space-y-3">
                <button
                  onClick={clearFavorites}
                  className="text-sm text-grey hover:text-red-500 transition-colors"
                >
                  Limpiar favoritos
                </button>
                
                <Button onClick={onClose} className="w-full" variant="outline">
                  Continuar comprando
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
