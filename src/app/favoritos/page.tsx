'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { useCartStore } from '@/lib/store/useCartStore';

export default function FavoritosPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const { addItem } = useCartStore();

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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentPage="inicio"
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-grey">
            <Link href="/" className="hover:text-secondary">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">Lista de Deseos</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-secondary fill-secondary" />
            <h1 className="font-playfair text-3xl font-bold text-primary">
              Mi Lista de Deseos
            </h1>
            <span className="bg-secondary text-white text-sm px-3 py-1 rounded-full">
              {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar lista
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart className="w-24 h-24 text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-playfair text-primary mb-2">
              Tu lista de deseos está vacía
            </h2>
            <p className="text-grey mb-8">
              Explora nuestra tienda y guarda tus productos favoritos
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Ir a la Tienda
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-playfair text-2xl text-gray-300">Georgina</span>
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-secondary fill-secondary" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm text-grey mb-1 capitalize">{product.category}</p>
                  <h3 className="font-medium text-primary mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className={`font-bold ${product.originalPrice ? 'text-secondary' : 'text-primary'}`}>
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar al Carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
      <CartButton />
      <CartDrawer />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}