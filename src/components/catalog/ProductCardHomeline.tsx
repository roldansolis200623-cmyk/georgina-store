'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/useCartStore';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { useToast } from '@/components/ui/Toast';
import { StarRating } from '@/components/catalog/StarRating';

interface ProductCardHomelineProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCardHomeline({ product, onQuickView }: ProductCardHomelineProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isProductFavorite = isFavorite(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    showToast('Agregado al carrito', 'success');
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
    showToast(
      isProductFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      'success'
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      router.push(`/producto/${product.id}`);
    }
  };

  const handleCardClick = () => {
    router.push(`/producto/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge && product.badge !== 'oferta' && (
            <span className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {product.badge}
            </span>
          )}
          {product.stock !== null && product.stock <= 3 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              ¡Últimas {product.stock}!
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
            isProductFavorite
              ? 'bg-secondary text-white'
              : 'bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
              <span className="font-playfair text-3xl text-gray-200 italic">Georgina</span>
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="flex gap-2">
            <button
              onClick={handleQuickView}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-primary py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white py-2.5 rounded-full text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-primary px-4 py-2 rounded-full text-sm font-medium">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-1">
        <p className="text-xs text-secondary font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="font-medium text-primary text-sm mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        
        {/* Star Rating */}
        <div className="mb-2">
          <StarRating productId={product.id} size="sm" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}